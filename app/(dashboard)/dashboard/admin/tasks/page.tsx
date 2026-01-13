/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Plus,
  Clock,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Timer,
  Send,
  X,
  RefreshCw,
  Briefcase,
  ChevronRight,
  Calendar,
  User as UserIcon,
  AlignLeft,
  BarChart3,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function AdminTaskOverview() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  // মডাল স্টেট
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "Medium",
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.token) {
        setToken(user.token);
        fetchData(user.token);
      }
    }
  }, []);

  const fetchData = async (authToken: string) => {
    setLoading(true);
    try {
      const userRes = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(userRes.data);

      const taskRes = await axios.get(`${API_URL}/tasks/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (Array.isArray(taskRes.data)) setTasks(taskRes.data);
    } catch (error: any) {
      toast.error("Failed to sync records");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks/create`, newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deployed!");
      setShowDeployModal(false);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        deadline: "",
        priority: "Medium",
      });
      fetchData(token);
    } catch (error: any) {
      toast.error("Assignment failed");
    }
  };

  const openDetails = (task: any) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 space-y-4 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <ToastContainer theme="dark" autoClose={1500} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Task Engine
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => fetchData(token)}
            className="p-2 text-slate-400 hover:text-blue-500 transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={() => setShowDeployModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md"
          >
            <Plus size={14} /> New Deployment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Active",
            val: tasks.filter((t) => t.status !== "Completed").length,
            color: "text-blue-500",
            icon: <Timer size={16} />,
          },
          {
            label: "Completed",
            val: tasks.filter((t) => t.status === "Completed").length,
            color: "text-emerald-500",
            icon: <CheckCircle2 size={16} />,
          },
          {
            label: "High Alert",
            val: tasks.filter((t) => t.priority === "High").length,
            color: "text-rose-500",
            icon: <AlertCircle size={16} />,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                {s.label}
              </p>
              <h3 className="text-xl font-black dark:text-white">{s.val}</h3>
            </div>
            <div
              className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 ${s.color}`}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Search & List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={14}
            />
            <input
              type="text"
              placeholder="Search mission or agent..."
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-[11px] font-bold outline-none dark:text-slate-200 border border-slate-200 dark:border-slate-700 focus:border-blue-500/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse hidden md:table">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Mission</th>
                <th className="p-4">Agent</th>
                <th className="p-4">Deadline</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="animate-spin inline text-blue-500" />
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task._id}
                    onClick={() => openDetails(task)}
                    className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-600/5 transition-all"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-1 h-8 rounded-full ${
                            task.priority === "High"
                              ? "bg-rose-500"
                              : task.priority === "Medium"
                              ? "bg-amber-500"
                              : "bg-blue-500"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="text-[12px] font-bold dark:text-slate-200 truncate uppercase">
                            {task.title}
                          </p>
                          <p
                            className={`text-[8px] font-black uppercase ${
                              task.priority === "High"
                                ? "text-rose-500"
                                : "text-slate-500"
                            }`}
                          >
                            {task.priority} Priority
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[11px] font-bold dark:text-slate-300 uppercase tracking-tighter">
                      {task.assignedTo?.name || "Unassigned"}
                    </td>
                    <td className="p-4 text-[10px] font-bold text-slate-500">
                      {new Date(task.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                          task.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : task.status === "In-Progress"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-slate-500/10 text-slate-500"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.map((task) => (
              <div
                key={task._id}
                onClick={() => openDetails(task)}
                className="p-4 space-y-3 active:bg-blue-50 dark:active:bg-blue-900/10"
              >
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold dark:text-slate-200 uppercase">
                    {task.title}
                  </p>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase border ${
                      task.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                  <span className="bg-slate-100 dark:bg-slate-800 p-1 px-2 rounded-lg">
                    {task.assignedTo?.name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />{" "}
                    {new Date(task.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Details Modal --- */}
      <AnimatePresence>
        {showDetailsModal && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <div
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${
                      selectedTask.priority === "High"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    }`}
                  >
                    {selectedTask.priority} Priority
                  </div>
                  <X
                    onClick={() => setShowDetailsModal(false)}
                    className="text-slate-400 cursor-pointer hover:text-rose-500"
                    size={20}
                  />
                </div>

                <div className="space-y-2 text-center">
                  <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                    {selectedTask.title}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Operational Deployment
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <UserIcon size={16} className="text-blue-500" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Assigned Agent
                      </p>
                      <p className="text-xs font-bold dark:text-slate-200 uppercase">
                        {selectedTask.assignedTo?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-emerald-500" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Mission Deadline
                      </p>
                      <p className="text-xs font-bold dark:text-slate-200">
                        {new Date(selectedTask.deadline).toDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 size={16} className="text-amber-500" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Status
                      </p>
                      <p className="text-xs font-bold dark:text-slate-200 uppercase">
                        {selectedTask.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-400">
                    <AlignLeft size={14} />
                    <span className="text-[9px] font-black uppercase">
                      Briefing Details
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/80 p-3 rounded-xl min-h-[80px]">
                    {selectedTask.description ||
                      "No specific instructions provided for this mission."}
                  </p>
                </div>

                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Acknowledge & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Deployment Modal (Create New) --- */}
      <AnimatePresence>
        {showDeployModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeployModal(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="p-5 space-y-5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-500" />
                    <h2 className="text-sm font-black dark:text-white uppercase tracking-tighter">
                      Deploy Task
                    </h2>
                  </div>
                  <X
                    onClick={() => setShowDeployModal(false)}
                    className="text-slate-400 cursor-pointer"
                    size={18}
                  />
                </div>

                <form onSubmit={handleAssignTask} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Title
                    </label>
                    <input
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[11px] font-bold dark:text-white outline-none border border-slate-200 dark:border-slate-700"
                      placeholder="Task name"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Agent
                      </label>
                      <select
                        required
                        className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[10px] font-bold dark:text-white outline-none border border-slate-200 dark:border-slate-700"
                        value={newTask.assignedTo}
                        onChange={(e) =>
                          setNewTask({ ...newTask, assignedTo: e.target.value })
                        }
                      >
                        <option value="">Choose</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        Priority
                      </label>
                      <select
                        className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[10px] font-bold dark:text-white outline-none border border-slate-200 dark:border-slate-700"
                        value={newTask.priority}
                        onChange={(e) =>
                          setNewTask({ ...newTask, priority: e.target.value })
                        }
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Deadline
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl text-[11px] font-bold dark:text-white outline-none border border-slate-200 dark:border-slate-700"
                      value={newTask.deadline}
                      onChange={(e) =>
                        setNewTask({ ...newTask, deadline: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Briefing
                    </label>
                    <textarea
                      className="w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl text-[11px] font-bold dark:text-white outline-none h-20 resize-none border border-slate-200 dark:border-slate-700"
                      placeholder="Mission briefing"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> Execute
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
