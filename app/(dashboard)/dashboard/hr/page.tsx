/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Users,
  Clock,
  FileText,
  UserCheck,
  RefreshCw,
  Search,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Fingerprint,
  Cpu,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function HRDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeToday: 0,
    pendingLeaves: 0,
    lateToday: 0,
  });

  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [recentLeaves, setRecentLeaves] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchHRMetrics(parsed.token);
    }
  }, []);

  const fetchHRMetrics = async (token: string) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, leavesRes, attendanceRes] = await Promise.all([
        axios.get(`${API_URL}/auth/users`, config),
        axios.get(`${API_URL}/leaves/all`, config),
        axios.get(`${API_URL}/attendance/all`, config),
      ]);

      const staff = usersRes.data;
      const leaves = leavesRes.data;
      const attendance = attendanceRes.data;

      const todayISO = new Date().toISOString().split("T")[0];
      const todaysAttendance = attendance.filter((a: any) =>
        a.date.includes(todayISO)
      );

      const activeStaff = todaysAttendance.filter(
        (a: any) => a.status === "Present" || a.status === "Late"
      ).length;

      const lates = todaysAttendance.filter(
        (a: any) => a.status === "Late"
      ).length;
      const pendingL = leaves.filter((l: any) => l.status === "Pending").length;

      setStats({
        totalStaff: staff.length,
        activeToday: activeStaff,
        pendingLeaves: pendingL,
        lateToday: lates,
      });

      setRecentLeaves(leaves.slice(0, 5));

      const deptMap: any = {};
      staff.forEach((s: any) => {
        const d = s.department || "General";
        deptMap[d] = (deptMap[d] || 0) + 1;
      });

      const deptStats = Object.keys(deptMap).map((key, idx) => ({
        name: key,
        count: deptMap[key],
        color: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"][idx % 4],
      }));
      setAttendanceData(deptStats);
    } catch (error) {
      console.error("HR Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const hrCards = [
    {
      label: "Total Staff",
      value: stats.totalStaff,
      icon: <Users size={18} />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Today",
      value: stats.activeToday,
      icon: <UserCheck size={18} />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Pending Leaves",
      value: stats.pendingLeaves,
      icon: <FileText size={18} />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Late Records",
      value: stats.lateToday,
      icon: <Clock size={18} />,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6 transition-all duration-300">
      {/* Header - Refined Dark Theme */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20">
            <Cpu size={22} />
          </div>
          <div>
            <h1 className="text-[14px] font-black dark:text-white uppercase tracking-wider">
              HR COMMAND CENTER
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Fingerprint size={11} className="text-blue-500" /> Operator:{" "}
              {user?.name} • HR Terminal
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchHRMetrics(user?.token)}
          className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
        >
          <RefreshCw
            size={15}
            className={
              loading
                ? "animate-spin text-blue-500"
                : "text-slate-500 group-hover:rotate-180 duration-500"
            }
          />
        </button>
      </div>

      {/* Stats Cards - Sharp 1px Borders */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {hrCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-blue-500/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`${card.bg} ${card.color} p-2 rounded-md`}>
                {card.icon}
              </div>
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                {card.label}
              </span>
            </div>
            <span className="text-sm font-black dark:text-white leading-none">
              {loading ? ".." : card.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Department Distribution - Dynamic Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8 px-1">
            <div className="flex items-center gap-2.5">
              <TrendingUp size={16} className="text-blue-500" />
              <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest">
                Departmental Registry
              </h3>
            </div>
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded border border-slate-100 dark:border-slate-800">
              Live Distribution
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#80808015"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b", fontWeight: "bold" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#64748b" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "8px",
                    fontSize: "10px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={42}>
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Requests - Sidebar Module */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest flex items-center gap-2.5">
              <FileText size={16} className="text-slate-400" /> Pending Registry
            </h3>
            <button className="text-[9px] font-black text-blue-500 uppercase hover:underline tracking-widest transition-all">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentLeaves.length > 0 ? (
              recentLeaves.map((leave: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-4 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/40 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase border ${
                        leave.status === "Pending"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {leave.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                      {leave.leaveType}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-[12px] font-black dark:text-white uppercase tracking-tight truncate group-hover:text-blue-500 transition-colors">
                      {leave.employee?.name || "System User"}
                    </h4>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                <Search
                  size={26}
                  className="text-slate-300 dark:text-slate-800 mb-3"
                />
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                  Registry Empty
                </p>
              </div>
            )}
          </div>

          {/* HR Action Banner */}
          <div className="p-6 bg-slate-900 dark:bg-white rounded-xl border-[1px] border-slate-800 dark:border-slate-200 shadow-lg relative overflow-hidden group cursor-pointer transition-all active:scale-[0.98]">
            <div className="absolute -right-2 -bottom-2 opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform">
              <Briefcase size={70} className="text-white dark:text-slate-900" />
            </div>
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
              System Operations
            </p>
            <p className="text-[13px] font-black text-white dark:text-slate-900 uppercase leading-tight">
              Manage Staff Payroll & Legal Documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
