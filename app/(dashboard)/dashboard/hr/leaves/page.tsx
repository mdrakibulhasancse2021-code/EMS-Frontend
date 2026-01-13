/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FileText,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
  AlertCircle,
  Cpu,
  Fingerprint,
  MessageSquare,
  ShieldCheck,
  Briefcase,
  Hash,
  Globe,
  Zap,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/leaves";

export default function HRLeaveRegistry() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      setCurrentUser(user);
      fetchLeaves(user.token);
    }
  }, []);

  const fetchLeaves = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLeaves(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Records sync failure");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    if (currentUser.role === "HR") {
      toast.warning("Access Restricted: Tier-1 Admin override required");
      return;
    }
    try {
      await axios.put(
        `${API_URL}/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Protocol Updated: ${newStatus}`);
      fetchLeaves(token);
    } catch (error) {
      toast.error("Execution failed");
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const matchesSearch =
      leave.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || leave.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-2 md:p-1 space-y-3 transition-all duration-500 font-sans">
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        style={{ marginTop: "65px" }}
      />

      {/* --- Compact Command Header --- */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-4 relative overflow-hidden shadow-sm backdrop-blur-md">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
          <Globe size={80} className="text-blue-500" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 dark:bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-600 border border-blue-600/20 shadow-lg">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none">
                Authorization Registry
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[7px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                  <Fingerprint size={8} /> Node: {currentUser?.role}
                </span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Zap size={8} className="text-amber-500" /> Live Data Stream
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchLeaves(token)}
              className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-blue-500 transition-all"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-2 px-4 rounded-md">
              <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mb-0.5 text-center">
                Active Requests
              </p>
              <p className="text-[10px] font-black dark:text-blue-400 text-center uppercase">
                {filteredLeaves.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Sleek Filter Bar --- */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={14}
          />
          <input
            type="text"
            placeholder="Identify record via personnel name or protocol type..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-blue-600/40 focus:border-blue-600/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-950/40 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-1">
          {["All", "Pending", "Approved", "Rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all ${
                filterStatus === status
                  ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- Optimized Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-10">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-[220px] bg-slate-100 dark:bg-slate-900/30 rounded-lg animate-pulse border border-slate-200 dark:border-slate-800"
                />
              ))
          ) : filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={leave._id}
                className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col group hover:border-blue-500/30 transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <Hash size={10} className="text-blue-500" />
                    <span className="text-[8px] font-black text-slate-500 tracking-widest uppercase">
                      {leave._id.slice(-6)}
                    </span>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded text-[7px] font-black uppercase border tracking-tighter ${
                      leave.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : leave.status === "Rejected"
                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    }`}
                  >
                    {leave.status}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-lg flex items-center justify-center font-black text-blue-500 text-xs border border-white/5 uppercase shadow-inner">
                    {leave.employee?.name?.charAt(0)}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <h3 className="text-[11px] font-black dark:text-white uppercase tracking-tight truncate">
                      {leave.employee?.name || "Terminated"}
                    </h3>
                    <p className="text-[8px] text-slate-500 dark:text-slate-500 font-bold uppercase mt-1 flex items-center gap-1">
                      <Briefcase size={8} />{" "}
                      {leave.employee?.department || "General Ops"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50 mb-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[7px] font-black text-slate-400 uppercase">
                      Protocol:{" "}
                      <span className="text-blue-500">{leave.leaveType}</span>
                    </span>
                    <ShieldCheck size={14} className="text-slate-700" />
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-left leading-none">
                      <p className="text-[6px] font-black text-slate-500 uppercase mb-1">
                        From
                      </p>
                      <p className="text-[9px] font-bold dark:text-slate-300">
                        {new Date(leave.startDate).toLocaleDateString(
                          undefined,
                          { day: "2-digit", month: "short" }
                        )}
                      </p>
                    </div>
                    <ChevronRight size={10} className="text-slate-600 mt-2" />
                    <div className="text-right leading-none">
                      <p className="text-[6px] font-black text-slate-500 uppercase mb-1">
                        To
                      </p>
                      <p className="text-[9px] font-bold dark:text-slate-300">
                        {new Date(leave.endDate).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 mb-4">
                  <div className="p-3 bg-white dark:bg-slate-950/40 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 italic line-clamp-2 leading-relaxed">
                      "{leave.reason || "No protocol reason log."}"
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateStatus(leave._id, "Rejected")}
                    disabled={leave.status !== "Pending"}
                    className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${
                      leave.status === "Pending"
                        ? "bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white"
                        : "opacity-10 grayscale border border-slate-700"
                    }`}
                  >
                    <XCircle size={12} /> Deny
                  </button>
                  <button
                    onClick={() => updateStatus(leave._id, "Approved")}
                    disabled={leave.status !== "Pending"}
                    className={`py-2 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      leave.status === "Pending"
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/40"
                        : "opacity-10 grayscale bg-slate-800"
                    }`}
                  >
                    <CheckCircle2 size={12} /> Permit
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center gap-2 bg-white dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <AlertCircle size={24} className="text-slate-700" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                Null Registry Logs
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Footer Status Hub --- */}
      <div className="flex items-center justify-between px-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-500 italic">
          <MessageSquare size={10} />
          <p className="text-[7px] font-bold uppercase tracking-widest opacity-60">
            Authorized leave requests are synchronized with payroll logic.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">
            Master Node:
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[6px] font-black rounded uppercase tracking-tighter">
            Encrypted-V2
          </span>
        </div>
      </div>
    </div>
  );
}
