/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Loader2,
  Calendar,
  User,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/leaves";

export default function AdminLeaveManagement() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchLeaves(user.token);
    }
  }, []);

  const fetchLeaves = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLeaves(data);
    } catch (error) {
      toast.error("Failed to sync leave records");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "Approved" | "Rejected"
  ) => {
    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Leave request ${newStatus.toLowerCase()}!`);
      fetchLeaves(token);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch = leave.employee?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-10 min-h-screen">
      <ToastContainer theme="dark" position="top-center" autoClose={2000} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              Leave Requests
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
              <FileText size={12} className="text-blue-500" /> Pending Action:{" "}
              {leaves.filter((l) => l.status === "Pending").length}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchLeaves(token)}
          className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-all shadow-sm"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#020617] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by employee name..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
          {["All", "Pending", "Approved", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                filterStatus === s
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Leave Cards - Better for Dark Mode Experience */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin mx-auto text-blue-500" size={40} />
          </div>
        ) : (
          filteredLeaves.map((leave) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={leave._id}
              className="bg-white dark:bg-[#020617] border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:border-blue-500/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center font-black text-blue-600 text-sm">
                    {leave.employee?.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {leave.employee?.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                      {leave.employee?.designation} •{" "}
                      {leave.employee?.department}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${
                    leave.status === "Approved"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      : leave.status === "Rejected"
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  }`}
                >
                  {leave.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                    Leave Type
                  </p>
                  <p className="text-xs font-bold dark:text-slate-200 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                    {leave.leaveType} Leave
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-black text-slate-400 uppercase mb-1">
                    Duration
                  </p>
                  <p className="text-[10px] font-bold dark:text-slate-200 flex items-center gap-1.5">
                    <Calendar size={12} className="text-slate-400" />
                    {new Date(leave.startDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {new Date(leave.endDate).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">
                  <MessageSquare size={10} /> Reason for Leave
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{leave.reason}"
                </p>
              </div>

              {leave.status === "Pending" && (
                <div className="flex gap-3 pt-4 border-t border-slate-50 dark:border-slate-800">
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Approved")}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(leave._id, "Rejected")}
                    className="flex-1 py-3 bg-white dark:bg-slate-900 text-rose-500 border border-rose-500/20 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {!loading && filteredLeaves.length === 0 && (
        <div className="p-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
          No matching leave requests found
        </div>
      )}
    </div>
  );
}
