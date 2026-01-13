/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ArrowRight,
  Cpu,
  Fingerprint,
  ShieldCheck,
  Zap,
  CircleDashed,
  Archive,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/tasks";

export default function MyTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const { data } = await axios.get(`${API_URL}/my-tasks`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks(data);
    } catch (error: any) {
      toast.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.put(
        `${API_URL}/${taskId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Pipeline Updated: ${newStatus}`);
      fetchMyTasks();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const filteredTasks = tasks.filter((task) =>
    filter === "All" ? true : task.status === filter
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6">
      <ToastContainer
        theme="dark"
        autoClose={2000}
        style={{ zIndex: 999999, top: "90px" }}
      />

      {/* --- Page Header --- */}
      <div className="flex flex-col gap-4 bg-white dark:bg-slate-900/80 p-4 md:p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20 shrink-0">
            <Cpu size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="text-[14px] font-black dark:text-white uppercase tracking-wider truncate">
              Task Control Console
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1 truncate">
              <Fingerprint size={11} className="text-blue-500" /> Pipeline:
              Operation Logs
            </p>
          </div>
        </div>

        {/* --- Filter Section (Fixed Overflow for Mobile) --- */}
        <div className="w-full overflow-x-auto no-scrollbar md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border-[1px] border-slate-200 dark:border-slate-800 shadow-inner min-w-max">
            {["All", "To-Do", "In-Progress", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-slate-500 hover:text-blue-500"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Micro Stats (Responsive Grid) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Total Ops"
          count={tasks.length}
          color="text-blue-500"
          icon={<ClipboardList size={16} />}
        />
        <StatCard
          label="Backlog"
          count={tasks.filter((t) => t.status === "To-Do").length}
          color="text-slate-500"
          icon={<Archive size={16} />}
        />
        <StatCard
          label="Live Execution"
          count={tasks.filter((t) => t.status === "In-Progress").length}
          color="text-amber-500"
          icon={<Zap size={16} />}
        />
        <StatCard
          label="Finalized"
          count={tasks.filter((t) => t.status === "Completed").length}
          color="text-emerald-500"
          icon={<CheckCircle2 size={16} />}
        />
      </div>

      {/* --- Tasks Display (Responsive Grid) --- */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((task, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                key={task._id}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500/40 transition-all flex flex-col hover:shadow-md h-full"
              >
                <div className="flex justify-between items-start mb-4 gap-2">
                  <span
                    className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-md border whitespace-nowrap ${
                      task.priority === "High"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : task.priority === "Medium"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                  <span
                    className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-md whitespace-nowrap ${
                      task.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : task.status === "In-Progress"
                        ? "bg-blue-500/10 text-blue-500 animate-pulse"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                <h3 className="text-[13px] font-black dark:text-white uppercase tracking-tight mb-2 group-hover:text-blue-500 transition-colors line-clamp-1">
                  {task.title}
                </h3>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-3 italic">
                  "{task.description || "System protocol execution requested."}"
                </p>

                <div className="mt-auto pt-4 border-t-[1px] border-slate-50 dark:border-slate-800/50 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 shrink-0">
                      <Calendar size={13} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase">
                        {new Date(task.deadline).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase shrink-0">
                      <Clock size={13} />{" "}
                      {task.status === "Completed" ? "Archived" : "Deadline"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {task.status !== "In-Progress" &&
                      task.status !== "Completed" && (
                        <button
                          onClick={() =>
                            updateTaskStatus(task._id, "In-Progress")
                          }
                          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/10"
                        >
                          Initiate Task
                        </button>
                      )}
                    {task.status === "In-Progress" && (
                      <button
                        onClick={() => updateTaskStatus(task._id, "Completed")}
                        className="w-full py-2.5 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/10"
                      >
                        Finalize Task
                      </button>
                    )}
                    {task.status === "Completed" && (
                      <div className="w-full py-2.5 bg-slate-50 dark:bg-slate-800/50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-[1px] border-slate-100 dark:border-slate-800">
                        <ShieldCheck size={12} /> Protocol Closed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 py-20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <CircleDashed
            size={35}
            className="text-slate-300 mb-3 animate-spin-slow"
          />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Pipeline Empty
          </p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, count, color, icon }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm hover:border-blue-500/20 transition-all">
      <div className="flex items-center gap-3">
        <div className={`${color} opacity-80`}>{icon}</div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight whitespace-nowrap">
          {label}
        </span>
      </div>
      <span className="text-[16px] font-black dark:text-white leading-none">
        {count}
      </span>
    </div>
  );
}
