/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Clock,
  Search,
  Calendar,
  UserCheck,
  UserX,
  AlertCircle,
  RefreshCw,
  Loader2,
  Filter,
  ArrowUpRight,
  Cpu,
  Fingerprint,
  MapPin,
  Download,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/attendance";

export default function HRAttendanceLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchAttendance(user.token);
    }
  }, []);

  const fetchAttendance = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to synchronize attendance logs");
    } finally {
      setLoading(false);
    }
  };

  // --- CSV ডাউনলোড লজিক ---
  const downloadReport = () => {
    if (filteredLogs.length === 0) {
      toast.warning("No data available to download");
      return;
    }

    // CSV Header
    const headers = [
      "Employee Name,Department,Date,Check-In,Check-Out,Status\n",
    ];

    // CSV Rows mapping
    const rows = filteredLogs.map((log) => {
      const name = log.employee?.name || "N/A";
      const dept = log.employee?.department || "N/A";
      const date = new Date(log.date).toLocaleDateString();
      const checkIn = formatTime(log.checkIn);
      const checkOut = log.checkOut ? formatTime(log.checkOut) : "Active";
      const status = log.status;
      return `${name},${dept},${date},${checkIn},${checkOut},${status}\n`;
    });

    const csvContent = headers.concat(rows).join("");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Attendance_Report_${new Date().toLocaleDateString()}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Registry Report Exported Successfully");
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employee?.department
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "--:--";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6 transition-all duration-300">
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        style={{ marginTop: "75px" }}
      />

      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20">
            <Calendar size={24} />
          </div>
          <div>
            <h1 className="text-[15px] font-black dark:text-white uppercase tracking-wider leading-none">
              Attendance Pulse
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <Fingerprint size={12} className="text-blue-500" /> HR Central
              Registry • Logs: {filteredLogs.length}
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchAttendance(token)}
          className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all group"
        >
          <RefreshCw
            size={16}
            className={
              loading
                ? "animate-spin text-blue-500"
                : "text-slate-500 group-hover:rotate-180 duration-500"
            }
          />
        </button>
      </div>

      {/* --- Search & Filters --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Identify by employee name or unit code..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-5 flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Present", "Late", "Absent"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`flex-1 px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                filterStatus === status
                  ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* --- Attendance Table --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-sans">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="p-5 text-[9px] font-black tracking-widest">
                  Personnel Entry
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-center">
                  Date
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-center">
                  Session Time
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-center">
                  Status
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-blue-600/5 transition-all group"
                  >
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-blue-600 text-[12px] uppercase">
                        {log.employee?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-slate-200 tracking-tight">
                          {log.employee?.name || "Terminated"}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">
                          {log.employee?.department || "General Ops"}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <p className="text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                        {new Date(log.date).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                        })}
                      </p>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase">
                          <Clock size={12} /> In: {formatTime(log.checkIn)}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                          Out:{" "}
                          {log.checkOut ? formatTime(log.checkOut) : "Active"}
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <span
                        className={`px-2.5 py-1 rounded text-[8px] font-black uppercase border tracking-widest ${
                          log.status === "Present"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : log.status === "Late"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-2">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                        <MapPin size={14} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Records Vacuum
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Footer Status with Download Trigger --- */}
      <div className="bg-slate-900 dark:bg-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 dark:bg-blue-600/10 rounded-xl flex items-center justify-center text-white dark:text-blue-600">
            <Cpu size={20} />
          </div>
          <p className="text-[11px] font-black text-white dark:text-slate-900 uppercase tracking-widest">
            System synchronized with secure database node.
          </p>
        </div>
        <button
          onClick={downloadReport} // ফাংশন কল করা হয়েছে
          className="px-6 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all active:scale-95 flex items-center gap-2"
        >
          <Download size={14} /> Export Report (.CSV)
        </button>
      </div>
    </div>
  );
}
