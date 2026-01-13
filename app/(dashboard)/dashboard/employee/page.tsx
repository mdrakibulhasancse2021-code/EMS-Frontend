/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Clock,
  CheckCircle2,
  Calendar,
  ClipboardList,
  RefreshCw,
  TrendingUp,
  Cpu,
  Fingerprint,
  ShieldCheck,
  Zap,
  ArrowRight,
  Loader2,
  AlertCircle,
  Activity,
  UserX,
  UserCheck,
  Timer,
  Target,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function EmployeeDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    absentDays: 0,
    presentDays: 0,
    lateDays: 0,
    completedTasks: 0,
    pendingTasks: 0,
    approvedLeaves: 0,
    productivity: 0,
  });

  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchEmployeeMetrics(parsed.token, parsed._id);
    }
  }, []);

  const fetchEmployeeMetrics = async (token: string, userId: string) => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [tasksRes, leavesRes, attendanceRes] = await Promise.all([
        axios.get(`${API_URL}/tasks/my-tasks`, config),
        axios.get(`${API_URL}/leaves/my-leaves`, config),
        axios.get(`${API_URL}/attendance/my-logs`, config),
      ]);

      const tasks = tasksRes.data;
      const leaves = leavesRes.data;
      const attendance = attendanceRes.data;

      // ১. টাস্ক ক্যালকুলেশন
      const completed = tasks.filter(
        (t: any) => t.status === "Completed"
      ).length;
      const pending = tasks.filter((t: any) => t.status !== "Completed").length;

      // ২. এটেনডেন্স ফিল্টারিং
      const absent = attendance.filter(
        (a: any) => a.status === "Absent"
      ).length;
      const present = attendance.filter(
        (a: any) => a.status === "Present"
      ).length;
      const late = attendance.filter((a: any) => a.status === "Late").length;

      setStats({
        absentDays: absent,
        presentDays: present,
        lateDays: late,
        completedTasks: completed,
        pendingTasks: pending,
        approvedLeaves: leaves.filter((l: any) => l.status === "Approved")
          .length,
        productivity:
          tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0,
      });

      setRecentTasks(tasks.slice(0, 4));

      // ৩. Dynamic Graph Logic (Last 7 Logs)
      const last7Days = attendance
        .slice(0, 7)
        .reverse()
        .map((day: any) => ({
          day: new Date(day.date).toLocaleDateString(undefined, {
            weekday: "short",
          }),
          intensity:
            day.status === "Present" ? 100 : day.status === "Late" ? 70 : 10,
        }));
      setGraphData(
        last7Days.length > 0
          ? last7Days
          : [
              { day: "Mon", intensity: 0 },
              { day: "Tue", intensity: 0 },
              { day: "Wed", intensity: 0 },
            ]
      );
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Morning Operation";
    if (hr < 17) return "Afternoon Shift";
    return "Evening Protocol";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-5 transition-all">
      {/* --- Dashboard Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/80 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20 shadow-inner">
            <Cpu size={26} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-[16px] font-black dark:text-white uppercase tracking-wider">
              {getTimeGreeting()}: {user?.name}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mt-1">
              <Fingerprint size={12} className="text-blue-500" /> Terminal:
              EMS-P7 • ID: {user?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchEmployeeMetrics(user?.token, user?._id)}
            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 group hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
          >
            <RefreshCw
              size={17}
              className={`${
                loading
                  ? "animate-spin text-blue-500"
                  : "text-slate-500 group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
          </button>
          <div className="px-4 py-2.5 bg-emerald-500/10 rounded-md border-[1px] border-emerald-500/20 flex items-center gap-2">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Protocol Linked
            </span>
          </div>
        </div>
      </div>

      {/* --- Extended Stats Grid --- */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          label="Present"
          value={stats.presentDays}
          icon={<UserCheck size={18} />}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
        />
        <StatCard
          label="Absent"
          value={stats.absentDays}
          icon={<UserX size={18} />}
          color="text-rose-500"
          bg="bg-rose-500/10"
        />
        <StatCard
          label="Late"
          value={stats.lateDays}
          icon={<Timer size={18} />}
          color="text-amber-500"
          bg="bg-amber-500/10"
        />
        <StatCard
          label="Active Tasks"
          value={stats.pendingTasks}
          icon={<Zap size={18} />}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <StatCard
          label="Leaves"
          value={stats.approvedLeaves}
          icon={<Calendar size={18} />}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <StatCard
          label="Progress"
          value={`${stats.productivity}%`}
          icon={<Target size={18} />}
          color="text-indigo-500"
          bg="bg-indigo-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* --- Dynamic Efficiency Chart --- */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-7 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8 px-1">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="text-[12px] font-black dark:text-white uppercase tracking-widest">
                Operational Waveform
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <Activity size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded border border-slate-100 dark:border-slate-700">
                Real-time Pulse
              </span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData}>
                <defs>
                  <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#80808015"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: "bold" }}
                />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "10px",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="intensity"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorWave)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- Sidebar Intel --- */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[12px] font-black dark:text-white uppercase tracking-widest flex items-center gap-2.5">
              <ClipboardList size={18} className="text-slate-400" /> Active
              Pipeline
            </h3>
            <ArrowRight
              size={16}
              className="text-slate-400 hover:text-blue-500 cursor-pointer transition-all"
            />
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-4 px-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/40 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                        task.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(task.deadline).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <h4 className="text-[13px] font-black dark:text-white uppercase tracking-tight truncate group-hover:text-blue-500 transition-colors">
                    {task.title}
                  </h4>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 py-16 rounded-xl border border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <AlertCircle size={26} className="text-slate-300 mb-3" />
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Feed Offline
                </p>
              </div>
            )}
          </div>

          {/* New Productivity Card */}
          <div className="p-6 bg-slate-900 dark:bg-white rounded-xl border-[1px] border-slate-800 dark:border-slate-200 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-3 -bottom-3 opacity-10 dark:opacity-20 group-hover:scale-110 transition-transform">
              <Target size={80} className="text-white dark:text-slate-900" />
            </div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Overall Completion
            </p>
            <div className="w-full h-2.5 bg-slate-800 dark:bg-slate-100 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.productivity}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              />
            </div>
            <p className="text-[14px] font-black text-white dark:text-slate-900 uppercase">
              {stats.productivity}% Finished
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, bg }: any) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-slate-900 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 flex flex-col gap-3 shadow-sm"
    >
      <div
        className={`${bg} ${color} w-10 h-10 rounded-lg flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {label}
        </p>
        <h2 className="text-[16px] font-black dark:text-white leading-none">
          {value}
        </h2>
      </div>
    </motion.div>
  );
}
