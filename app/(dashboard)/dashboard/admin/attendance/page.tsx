/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Clock,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Timer,
  Calendar,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/attendance";

export default function AdminAttendance() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  // মাসের লিস্ট এবং সিলেক্টেড মাস স্টেট
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [monthsList, setMonthsList] = useState<string[]>([]);

  useEffect(() => {
    // গত ৬ মাসের ড্রপডাউন জেনারেট করা
    const months = [];
    const d = new Date();
    for (let i = 0; i < 6; i++) {
      const tempDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      const monthStr =
        tempDate.toLocaleString("default", { month: "long" }) +
        "-" +
        tempDate.getFullYear();
      months.push(monthStr);
    }
    setMonthsList(months);
    setSelectedMonth(months[0]); // ডিফল্ট বর্তমান মাস

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchLogs(user.token);
    }
  }, []);

  const fetchLogs = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setLogs(data);
    } catch (error) {
      toast.error("Failed to sync records");
    } finally {
      setLoading(false);
    }
  };

  // --- ফ্রন্টএন্ড মাস ফিল্টারিং লজিক ---
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.date);
    const logMonthStr =
      logDate.toLocaleString("default", { month: "long" }) +
      "-" +
      logDate.getFullYear();

    const matchesMonth = logMonthStr === selectedMonth;
    const matchesSearch =
      log.employee?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employee?.phone?.includes(searchTerm);

    return matchesMonth && matchesSearch;
  });

  const stats = {
    present: filteredLogs.filter((l) => l.status === "Present").length,
    late: filteredLogs.filter((l) => l.status === "Late").length,
    absent: filteredLogs.filter((l) => l.status === "Absent").length,
  };

  return (
    <div className="space-y-4 pb-10 min-h-screen">
      <ToastContainer theme="dark" autoClose={2000} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Attendance Records
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Timekeeping for {selectedMonth}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* মাস সিলেক্টর ড্রপডাউন */}
          <div className="flex items-center gap-2 bg-white dark:bg-[#020617] p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            <Calendar size={14} className="ml-2 text-slate-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 outline-none p-2 cursor-pointer"
            >
              {monthsList.map((m) => (
                <option key={m} value={m} className="dark:bg-slate-900">
                  {m}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => fetchLogs(token)}
            className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="p-4 bg-white dark:bg-[#020617] rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Present
            </p>
            <h3 className="text-xl font-black dark:text-white">
              {stats.present}
            </h3>
          </div>
          <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-[#020617] rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Late
            </p>
            <h3 className="text-xl font-black dark:text-white">{stats.late}</h3>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
            <Timer size={18} />
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-[#020617] rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Absent marked
            </p>
            <h3 className="text-xl font-black dark:text-white">
              {stats.absent}
            </h3>
          </div>
          <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
            <Timer size={18} />
          </div>
        </div>
      </div>

      {/* Search Bar - Slim */}
      <div className="bg-white dark:bg-[#020617] p-2 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={14}
          />
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 border border-transparent focus:border-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Slim Table */}
      <div className="bg-white dark:bg-[#020617] border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest">
                  Personnel
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest text-center">
                  Date
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest">
                  Timing
                </th>
                <th className="p-4 text-[9px] font-black uppercase tracking-widest">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-blue-600/5 transition-all"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-black text-slate-500 text-[10px]">
                        {log.employee?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-slate-900 dark:text-slate-200">
                          {log.employee?.name}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium">
                          {log.employee?.department}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {new Date(log.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] font-black dark:text-slate-300">
                          <span className="text-emerald-500">IN</span>
                          {new Date(log.checkIn).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black dark:text-slate-300">
                          <span className="text-rose-500">OUT</span>
                          {log.checkOut
                            ? new Date(log.checkOut).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "--:--"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border ${
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && filteredLogs.length === 0 && (
            <div className="p-20 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              No activity recorded for {selectedMonth}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
