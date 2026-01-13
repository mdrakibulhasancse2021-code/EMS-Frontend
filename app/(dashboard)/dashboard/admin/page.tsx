/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Users,
  AlertCircle,
  RefreshCw,
  Wallet,
  TrendingUp,
  Download,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell as PieCell,
  LineChart,
  Line,
} from "recharts";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    payrollTotal: 0,
    productivityScore: 0,
  });

  const [deptDistribution, setDeptDistribution] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [performanceTrends, setPerformanceTrends] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchDashboardMetrics(parsed.token);
    }
  }, []);

  const fetchDashboardMetrics = async (token: string) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, leavesRes, attendanceRes, tasksRes] = await Promise.all([
        axios.get(`${API_URL}/auth/users`, config),
        axios.get(`${API_URL}/leaves/all`, config),
        axios.get(`${API_URL}/attendance/all`, config),
        axios.get(`${API_URL}/tasks/all`, config),
      ]);

      const users = usersRes.data;
      const leaves = leavesRes.data;
      const attendance = attendanceRes.data;
      const tasks = tasksRes.data;

      // 1. Dept Split
      const deptMap: any = {};
      users.forEach((u: any) => {
        const dept = u.department || "General";
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });
      const formattedDeptData = Object.keys(deptMap).map((key, idx) => ({
        name: key,
        value: deptMap[key],
        color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"][idx % 5],
      }));
      setDeptDistribution(formattedDeptData);

      // 2. Real Productivity Logic
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(
        (t: any) => t.status === "Completed"
      ).length;
      const realProductivity =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const lastSixRecords = attendance
        .slice(-6)
        .map((record: any, index: number) => {
          const date = new Date(record.date).toLocaleString("default", {
            month: "short",
          });
          const dailyPresence = (record.presentCount / users.length) * 100 || 0;
          return {
            name: date || `Node ${index + 1}`,
            attendance: Math.round(dailyPresence),
            productivity: realProductivity,
          };
        });
      setPerformanceTrends(lastSixRecords);

      // 3. Stats Summary
      const totalSalary = users.reduce(
        (acc: number, curr: any) => acc + (curr.baseSalary || 0),
        0
      );
      const pendingL = leaves.filter((l: any) => l.status === "Pending").length;

      setStats({
        totalEmployees: users.length,
        pendingLeaves: pendingL,
        payrollTotal: totalSalary,
        productivityScore: realProductivity,
      });

      // 4. Combined Activity Stream (Tasks + Leaves)
      const taskActivities = tasks.map((task: any) => ({
        id: task._id,
        user: task.assignedTo?.name || "User",
        action: `is working on "${task.title}"`,
        time: new Date(task.updatedAt).getTime(),
        displayTime: new Date(task.updatedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        category: "task",
        type: task.status === "Completed" ? "success" : "warning",
      }));

      const leaveActivities = leaves.map((leave: any) => ({
        id: leave._id,
        user: leave.employee?.name || "User",
        action: `requested ${leave.leaveType} leave`,
        time: new Date(leave.createdAt).getTime(),
        displayTime: new Date(leave.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        category: "leave",
        type: leave.status === "Pending" ? "info" : "success",
      }));

      // Merge and Sort by Time Descending
      const mergedActivities = [...taskActivities, ...leaveActivities]
        .sort((a, b) => b.time - a.time)
        .slice(0, 6);

      setRecentActivities(mergedActivities);
    } catch (error) {
      console.error("Critical Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: "Total Staff",
      value: stats.totalEmployees,
      icon: <Users size={20} />,
      color: "from-blue-600 to-indigo-600",
    },
    {
      label: "Open Requests",
      value: stats.pendingLeaves,
      icon: <AlertCircle size={20} />,
      color: "from-amber-500 to-orange-600",
    },
    {
      label: "Payroll Calc",
      value: `৳${(stats.payrollTotal / 100000).toFixed(1)}L`,
      icon: <Wallet size={20} />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      label: "Global Efficiency",
      value: `${stats.productivityScore}%`,
      icon: <TrendingUp size={20} />,
      color: "from-purple-600 to-pink-600",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 space-y-6 bg-slate-50/50 dark:bg-transparent">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black dark:text-white uppercase tracking-tight">
            System Intel: Admin
          </h1>
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">
            Cross-Module Integration Live
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchDashboardMetrics(user?.token)}
            className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all"
          >
            <RefreshCw
              size={18}
              className={
                loading ? "animate-spin text-blue-500" : "text-slate-500"
              }
            />
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20">
            System Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}
              >
                {card.icon}
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-3xl font-black dark:text-white mb-1">
              {loading ? "..." : card.value}
            </div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Live Efficiency Graph
            </h3>
            <div className="flex gap-4 text-[9px] font-black uppercase text-slate-500">
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Presence
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Tasking
              </span>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#80808010"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 9, fill: "#64748b", fontWeight: "bold" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: "#0f172a",
                    color: "#fff",
                    fontSize: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#3b82f6" }}
                />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke="#10b981"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dept Distribution */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8">
            Workforce Clusters
          </h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={deptDistribution}
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {deptDistribution.map((entry, index) => (
                    <PieCell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {deptDistribution.map((dept, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="text-slate-500">{dept.name}</span>
                </div>
                <span className="dark:text-white">{dept.value} NODES</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Multi-Module Live Monitor */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">
          Cross-Module Activity Monitor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-600/50 transition-all group"
            >
              <div
                className={`p-2.5 rounded-lg ${
                  act.category === "leave"
                    ? "bg-blue-500/10 text-blue-500"
                    : act.type === "warning"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-emerald-500/10 text-emerald-500"
                }`}
              >
                {act.category === "leave" ? (
                  <Calendar size={16} />
                ) : act.type === "warning" ? (
                  <Clock size={16} />
                ) : (
                  <CheckCircle2 size={16} />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-black dark:text-white truncate uppercase tracking-tight">
                  {act.user}{" "}
                  <span className="font-bold text-slate-500 lowercase">
                    {act.action}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-[9px] text-blue-500 font-black uppercase tracking-widest opacity-70">
                    {act.displayTime}
                  </div>
                  <div
                    className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                      act.category === "leave"
                        ? "bg-blue-500/10 text-blue-500"
                        : "bg-slate-500/10 text-slate-500"
                    }`}
                  >
                    {act.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
