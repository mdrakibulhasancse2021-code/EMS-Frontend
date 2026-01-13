/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Search,
  Clock,
  User,
  ShieldAlert,
  RefreshCw,
  Loader2,
  Database,
  ArrowRightCircle,
  X,
  Info,
  ShieldCheck,
  Globe,
  Terminal,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function SystemLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  // মডাল স্টেট
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      if (user.token) {
        setToken(user.token);
        fetchLogs(user.token);
      }
    }
  }, []);

  const fetchLogs = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/logs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLogs(data);
    } catch (error: any) {
      toast.error("Audit logs could not be synced");
    } finally {
      setLoading(false);
    }
  };

  const handleLogClick = (log: any) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (type: string) => {
    switch (type) {
      case "Create":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Update":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Delete":
        return "text-rose-500 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 space-y-4 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <ToastContainer theme="dark" autoClose={1500} />

      {/* --- Compact Header --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-rose-600 rounded-full shadow-[0_0_10px_rgba(225,29,72,0.5)]" />
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Audit Trail
          </h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => fetchLogs(token)}
            className="p-2 text-slate-400 hover:text-rose-500 transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-slate-200 dark:border-slate-700">
            <Database size={12} className="text-rose-500" />
            <span className="text-[9px] font-black dark:text-slate-400 uppercase tracking-widest">
              System Health: Secure
            </span>
          </div>
        </div>
      </div>

      {/* --- Search & Analytics --- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="text-slate-400 ml-3" size={16} />
          <input
            type="text"
            placeholder="Filter audit trail by action or user..."
            className="bg-transparent w-full outline-none text-[11px] font-bold dark:text-white py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-rose-600 p-3 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-rose-600/20">
          <div>
            <p className="text-[8px] font-black uppercase opacity-80 text-white/70">
              Total Events
            </p>
            <h3 className="text-lg font-black leading-none">{logs.length}</h3>
          </div>
          <Activity size={20} />
        </div>
      </div>

      {/* --- Log Table --- */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 text-[9px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Entity/Action</th>
                <th className="p-4">Authorized By</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="animate-spin inline text-rose-500" />
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, i) => (
                  <tr
                    key={i}
                    onClick={() => handleLogClick(log)}
                    className="hover:bg-slate-50 dark:hover:bg-rose-600/5 transition-all group cursor-pointer"
                  >
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${getStatusStyle(
                            log.type
                          )}`}
                        >
                          {log.type}
                        </span>
                        <p className="text-[11px] font-bold dark:text-slate-200 uppercase tracking-tighter">
                          {log.action}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-md flex items-center justify-center text-rose-500 font-bold text-[9px]">
                          {log.user?.name?.charAt(0)}
                        </div>
                        <span className="text-[11px] font-bold dark:text-slate-300">
                          {log.user?.name || "System"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <ArrowRightCircle
                        size={14}
                        className="inline text-slate-300 group-hover:text-rose-500 transition-colors"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && filteredLogs.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center gap-2">
              <ShieldAlert
                className="text-slate-200 dark:text-slate-800"
                size={40}
              />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                No logs found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- Details Modal --- */}
      <AnimatePresence>
        {showModal && selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500">
                      <Info size={16} />
                    </div>
                    <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter">
                      Event Metadata
                    </h3>
                  </div>
                  <X
                    onClick={() => setShowModal(false)}
                    className="text-slate-400 cursor-pointer hover:text-rose-500 transition-colors"
                    size={18}
                  />
                </div>

                <div className="space-y-4">
                  {/* Action Title */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mb-1">
                      Action Performed
                    </p>
                    <h4 className="text-xs font-black dark:text-white uppercase tracking-tight">
                      {selectedLog.action}
                    </h4>
                  </div>

                  {/* User & IP */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <User size={10} />{" "}
                        <span className="text-[8px] font-black uppercase">
                          Initiator
                        </span>
                      </div>
                      <p className="text-[10px] font-bold dark:text-slate-200">
                        {selectedLog.user?.name || "System"}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-slate-400 mb-1">
                        <Globe size={10} />{" "}
                        <span className="text-[8px] font-black uppercase">
                          IP Source
                        </span>
                      </div>
                      <p className="text-[10px] font-bold dark:text-slate-200">
                        {selectedLog.ipAddress || "Internal"}
                      </p>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Terminal size={12} />{" "}
                      <span className="text-[9px] font-black uppercase">
                        Log Description
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <p className="text-[11px] font-medium text-slate-300 leading-relaxed italic">
                        "{selectedLog.details}"
                      </p>
                    </div>
                  </div>

                  {/* Time & Security */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock size={12} />
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(selectedLog.createdAt).toUTCString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500">
                      <ShieldCheck size={12} />
                      <span className="text-[8px] font-black uppercase">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
                >
                  Dismiss Insight
                </button>
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
          background: #e11d48;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
