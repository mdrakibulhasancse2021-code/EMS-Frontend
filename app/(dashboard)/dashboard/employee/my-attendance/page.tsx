/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Clock,
  MapPin,
  CheckCircle2,
  LogOut,
  AlertCircle,
  Loader2,
  Coffee,
  ShieldCheck,
  Fingerprint,
  History,
  ArrowRight,
  Activity,
  Timer,
  Shield,
  Zap,
  Lock,
  Cpu,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/attendance";

export default function WorkAttendance() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // ঘড়ি আপডেট করার সময় ঢাকার টাইমজোন মেইনটেইন করা
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchMyStatus();
  }, []);

  const fetchMyStatus = async () => {
    setLoading(true);
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      const { data } = await axios.get(`${API_URL}/my-status`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setStatus(data);
    } catch (error) {
      console.error("Status fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // বাটন ক্লিক করার সময় বর্তমান সময় যাচাই (ঢাকার সময় অনুযায়ী)
  const handleAction = async (type: "check-in" | "check-out") => {
    const now = new Date();
    // ঢাকার ঘণ্টা (Hour) বের করা
    const dhakaHour = parseInt(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Dhaka",
        hour: "numeric",
        hour12: false,
      }).format(now)
    );

    if (type === "check-in") {
      if (dhakaHour < 9) {
        toast.warning("Protocol Locked: Check-in starts at 09:00 AM.");
        return;
      }
      if (dhakaHour >= 10) {
        toast.error("Access Denied: Window closed at 10:00 AM.");
        return;
      }
    }

    if (type === "check-out") {
      if (dhakaHour < 16) {
        toast.warning("Forbidden: Shift ends at 04:00 PM.");
        return;
      }
      if (dhakaHour >= 22) {
        toast.error("System Lock: Marked as Absent due to late checkout.");
      }
    }

    setBtnLoading(true);
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      const user = JSON.parse(userString);
      const method = type === "check-in" ? "post" : "put";
      const { data } = await (axios as any)[method](
        `${API_URL}/${type}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(data.message);
      fetchMyStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={30} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-2 md:p-1 space-y-3 min-h-screen transition-all duration-300 font-sans">
      <ToastContainer
        theme="dark"
        autoClose={2500}
        position="top-center"
        style={{ zIndex: 999999, top: "75px" }}
      />

      {/* --- Sleek Header --- */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border border-blue-600/20">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="text-[12px] font-black dark:text-white uppercase tracking-wider leading-none">
              Shift Control Node
            </h1>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">
              <Zap size={10} className="text-amber-500" /> System Online:
              Asia/Dhaka
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[16px] font-black dark:text-white leading-none tracking-tighter">
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
          <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest mt-1 italic">
            {currentTime.toDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 transition-transform group-hover:rotate-45 duration-700">
              <Fingerprint size={100} />
            </div>

            <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Session Authorization
                </h3>
                <p className="text-[11px] font-bold dark:text-slate-200 flex items-center gap-2">
                  <Lock size={12} className="text-blue-500" />{" "}
                  {status?._id?.slice(-10).toUpperCase() || "GATEWAY_IDLE"}
                </p>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                  Security Link Active
                </span>
              </div>
            </div>

            <div className="relative z-10">
              {!status ? (
                <button
                  onClick={() => handleAction("check-in")}
                  disabled={btnLoading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {btnLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <MapPin size={16} />
                  )}
                  INITIATE CHECK-IN
                </button>
              ) : !status.checkOut ? (
                <button
                  onClick={() => handleAction("check-out")}
                  disabled={btnLoading}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                  {btnLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  FINALIZE CHECK-OUT
                </button>
              ) : (
                <div className="w-full py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Logs Finalized for Today
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500/10 rounded text-blue-500">
                  <Clock size={12} />
                </div>
                <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase leading-none">
                    Login Range
                  </p>
                  <p className="text-[9px] font-bold dark:text-slate-300">
                    09:00 - 10:00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 rounded text-rose-500">
                  <LogOut size={12} />
                </div>
                <div>
                  <p className="text-[7px] font-black text-slate-500 uppercase leading-none">
                    Logout Range
                  </p>
                  <p className="text-[9px] font-bold dark:text-slate-300">
                    16:00 - 22:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-start gap-3">
            <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[8px] font-medium text-amber-600/80 uppercase tracking-tight leading-relaxed">
              Protocol: Check-in after 09:15 records as 'Late'. Check-out after
              22:00 records as 'Absent' via system override.
            </p>
          </div>
        </div>

        {/* --- Log Timeline --- */}
        <div className="bg-white dark:bg-slate-900/40 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-500" />
              <h3 className="text-[10px] font-black dark:text-white uppercase tracking-widest">
                Protocol Timeline
              </h3>
            </div>
          </div>

          <div className="flex-1 space-y-8 relative px-1">
            <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-slate-200 dark:bg-slate-800" />

            <TimelineStep
              label="Check-In"
              time={
                status?.checkIn
                  ? new Date(status.checkIn).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "---"
              }
              active={!!status}
              color="bg-blue-500"
              sub={
                status?.status === "Late"
                  ? "Late Flagged"
                  : status
                  ? "Authorized"
                  : null
              }
            />

            <TimelineStep
              label="Shift Status"
              time={
                status && !status.checkOut
                  ? "Currently Active"
                  : status?.checkOut
                  ? "Shift Completed"
                  : "Waiting"
              }
              active={status}
              color="bg-indigo-500"
            />

            <TimelineStep
              label="Check-Out"
              time={
                status?.checkOut
                  ? new Date(status.checkOut).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "---"
              }
              active={!!status?.checkOut}
              color="bg-rose-500"
              isLast
              sub={
                status?.status === "Absent" && status?.checkOut
                  ? "System Lock Penalty"
                  : null
              }
            />
          </div>

          <button className="mt-6 w-full flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800/40 hover:bg-blue-600 hover:text-white rounded-lg transition-all group border border-transparent dark:border-slate-700/50">
            <span className="text-[9px] font-black uppercase tracking-widest">
              Personal History
            </span>
            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  label,
  time,
  active,
  color,
  isLast = false,
  sub,
}: any) {
  return (
    <div className="flex gap-4 relative group">
      <div
        className={`w-[14px] h-[14px] rounded-full z-10 border-2 border-white dark:border-slate-950 shrink-0 transition-all duration-700 ${
          active
            ? `${color} shadow-[0_0_10px_${color}]`
            : "bg-slate-300 dark:bg-slate-800"
        }`}
      />
      <div className={isLast ? "" : "pb-2"}>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">
          {label}
        </p>
        <p
          className={`text-[12px] font-black leading-none ${
            active ? "dark:text-white text-slate-900" : "text-slate-500"
          }`}
        >
          {time}
        </p>
        {sub && (
          <p
            className={`text-[7px] font-bold mt-1 uppercase tracking-widest ${
              sub.includes("Late") || sub.includes("Lock")
                ? "text-rose-500"
                : "text-emerald-500"
            }`}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
