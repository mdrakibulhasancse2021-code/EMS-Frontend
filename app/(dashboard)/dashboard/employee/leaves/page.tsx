/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Loader2,
  AlertCircle,
  History,
  Plus,
  ArrowRight,
  UserCheck,
  Info,
  X,
  Fingerprint,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/leaves";

export default function ApplyLeave() {
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<any>(null);

  const [formData, setFormData] = useState({
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const { data } = await axios.get(`${API_URL}/my-leaves`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMyLeaves(data);
    } catch (error: any) {
      toast.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      await axios.post(`${API_URL}/apply`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Request Submitted");
      setFormData({
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        reason: "",
      });
      fetchMyLeaves();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-3 md:p-6 space-y-5">
      <ToastContainer
        theme="dark"
        autoClose={2000}
        style={{ zIndex: 999999, top: "90px" }}
      />

      {/* --- Page Header (Refined & 1px Larger) --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900/80 p-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20">
            <Cpu size={22} />
          </div>
          <div>
            <h1 className="text-[13px] font-black dark:text-white uppercase tracking-wider">
              Leave Operations Hub
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Fingerprint size={11} className="text-blue-500" /> Authorized
              Terminal: Absence Registry
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 rounded-md border-[1px] border-emerald-500/20 flex items-center gap-2">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
            Policy Enforcement Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* --- Submission Module (Compact but Refined) --- */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Plus size={16} />
              </div>
              <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest">
                New Application
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Leave Category
                </label>
                <select
                  required
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[11px] font-bold dark:text-white outline-none transition-all"
                >
                  <option value="Casual">Casual (General)</option>
                  <option value="Sick">Sick (Medical)</option>
                  <option value="Earned">Earned (Privilege)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Effective
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[10px] font-bold dark:text-white outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Expiry
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[10px] font-bold dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Justification
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[11px] font-bold dark:text-white outline-none resize-none"
                  placeholder="State the purpose of absence..."
                />
              </div>

              <button
                disabled={submitLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/10 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {submitLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Send size={16} />
                )}
                Submit Protocol
              </button>
            </form>
          </div>
        </div>

        {/* --- History Logs --- */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest flex items-center gap-2.5">
              <History size={16} className="text-slate-400" /> Request Logs
            </h3>
            <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md border-[1px] border-slate-200 dark:border-slate-700">
              Entries: {myLeaves.length}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            <AnimatePresence>
              {myLeaves.length > 0 ? (
                myLeaves.map((leave, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={leave._id}
                    onClick={() => setSelectedLeave(leave)}
                    className="bg-white dark:bg-slate-900 p-4 px-5 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between group cursor-pointer hover:border-blue-500/30 transition-all active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-5">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border-[1px] ${
                          leave.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : leave.status === "Rejected"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        {leave.status === "Approved" ? (
                          <CheckCircle2 size={18} />
                        ) : leave.status === "Rejected" ? (
                          <XCircle size={18} />
                        ) : (
                          <Clock size={18} />
                        )}
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black dark:text-white uppercase tracking-tight leading-none mb-1.5">
                          {leave.leaveType} Absence
                        </h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          {new Date(leave.startDate).toLocaleDateString()} —{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="text-right hidden sm:block">
                        <span
                          className={`text-[8px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border transition-all ${
                            leave.status === "Approved"
                              ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5"
                              : leave.status === "Rejected"
                              ? "border-rose-500/30 text-rose-500 bg-rose-500/5"
                              : "border-amber-500/30 text-amber-500 bg-amber-500/5"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white dark:bg-slate-900 py-16 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center">
                  <AlertCircle size={28} className="text-slate-300 mb-3" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    No Registry Records Found
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- Detail Modal (Compact & High Contrast) --- */}
      <AnimatePresence>
        {selectedLeave && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLeave(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border-[1px] border-slate-200 dark:border-slate-800"
            >
              <div
                className={`h-16 w-full border-b-[1px] ${
                  selectedLeave.status === "Approved"
                    ? "bg-emerald-500/5 border-emerald-500/20"
                    : selectedLeave.status === "Rejected"
                    ? "bg-rose-500/5 border-rose-500/20"
                    : "bg-blue-500/5 border-blue-500/20"
                } flex items-center justify-between px-6`}
              >
                <h2
                  className={`text-[11px] font-black uppercase tracking-widest ${
                    selectedLeave.status === "Approved"
                      ? "text-emerald-500"
                      : selectedLeave.status === "Rejected"
                      ? "text-rose-500"
                      : "text-blue-500"
                  }`}
                >
                  Protocol Details
                </h2>
                <button
                  onClick={() => setSelectedLeave(null)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-all text-slate-400"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-7 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-[1px] border-slate-100 dark:border-slate-800">
                    <p className="text-[7px] font-black text-slate-400 uppercase mb-1.5 tracking-tighter">
                      Current Status
                    </p>
                    <p
                      className={`text-[11px] font-black uppercase ${
                        selectedLeave.status === "Approved"
                          ? "text-emerald-500"
                          : selectedLeave.status === "Rejected"
                          ? "text-rose-500"
                          : "text-amber-500"
                      }`}
                    >
                      {selectedLeave.status}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-[1px] border-slate-100 dark:border-slate-800">
                    <p className="text-[7px] font-black text-slate-400 uppercase mb-1.5 tracking-tighter">
                      Event Category
                    </p>
                    <p className="text-[11px] font-black dark:text-white uppercase">
                      {selectedLeave.leaveType}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-[1px] border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <Calendar size={16} className="text-blue-500" />
                  <p className="text-[10px] font-bold dark:text-white">
                    {new Date(selectedLeave.startDate).toLocaleDateString()} —{" "}
                    {new Date(selectedLeave.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[7px] font-black text-slate-400 uppercase flex items-center gap-2">
                    <Info size={12} className="text-blue-500" /> Reasoning Log
                  </p>
                  <p className="text-[11px] font-bold dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border-[1px] border-slate-100 dark:border-slate-800 italic">
                    "{selectedLeave.reason}"
                  </p>
                </div>

                {selectedLeave.status !== "Pending" && (
                  <div className="pt-4 border-t-[1px] border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
                    <UserCheck size={14} className="text-emerald-500" />
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-tight">
                      Validated by Operational Headquarters
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
