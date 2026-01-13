/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Phone,
  Fingerprint,
  Save,
  Loader2,
  Cpu,
  Camera,
  ShieldCheck,
  Zap,
  Settings,
  Globe,
  ShieldAlert,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const API_URL = "https://ems-backend-sigma.vercel.app/api/auth";

export default function HRSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [token, setToken] = useState("");
  const [profileData, setProfileData] = useState({ name: "", phone: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.token) {
      setToken(storedUser.token);
      fetchMyProfile(storedUser.token);
    }
  }, []);

  const fetchMyProfile = async (authToken: string) => {
    setFetching(true);
    try {
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(data);
      setProfileData({ name: data.name, phone: data.phone });
    } catch (error) {
      toast.error("Node Connection Offline");
    } finally {
      setFetching(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/profile/update`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, name: data.name })
      );
      toast.success("Identity Logs Synchronized");
      fetchMyProfile(token);
    } catch (error: any) {
      toast.error("Update Protocol Failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-blue-500" size={30} />
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">
          Accessing Core Data...
        </p>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto p-2 md:p-1 space-y-3 transition-all duration-500">
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        style={{ marginTop: "65px" }}
      />

      {/* --- Sleek Profile Header --- */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg p-4 relative overflow-hidden shadow-sm backdrop-blur-sm">
        <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
          <Cpu size={80} className="text-blue-500" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-14 h-14 bg-slate-900 dark:bg-blue-600 rounded-md flex items-center justify-center text-white text-xl font-black border border-white/5 shadow-2xl">
                {user?.name?.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1 bg-slate-800 dark:bg-slate-950 rounded border border-slate-700 text-blue-500 shadow-xl cursor-pointer hover:scale-110 transition-transform">
                <Camera size={10} />
              </div>
            </div>
            <div>
              <h1 className="text-md font-black dark:text-white uppercase tracking-tight leading-none">
                {user?.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[7px] font-black bg-blue-600 text-white px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={8} /> {user?.role}
                </span>
                <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <Zap size={8} className="text-amber-500" /> System Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-2 px-4 rounded-md">
              <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mb-0.5 text-center">
                Unit-Dept
              </p>
              <p className="text-[10px] font-black dark:text-slate-300 uppercase">
                {user?.department || "N/A"}
              </p>
            </div>
            <div className="bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-2 px-4 rounded-md">
              <p className="text-[6px] font-black text-slate-500 uppercase tracking-widest mb-0.5 text-center">
                Protocol Salary
              </p>
              <p className="text-[10px] font-black dark:text-blue-400 uppercase">
                ৳{user?.baseSalary?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Configuration Terminal --- */}
      <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings size={12} className="text-blue-500" />
            <h2 className="text-[9px] font-black dark:text-slate-300 uppercase tracking-[0.2em]">
              Registry Parameters
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 bg-blue-500 rounded-full animate-ping" />
            <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
              Linked
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="p-5 md:p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5 group">
              <label className="text-[8px] font-black uppercase text-slate-500 tracking-[0.15em] ml-0.5 flex items-center gap-1.5 transition-colors group-focus-within:text-blue-500">
                <User size={10} /> Personnel Identification Name
              </label>
              <input
                type="text"
                required
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded text-[11px] font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600/40 focus:border-blue-600/50 transition-all placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[8px] font-black uppercase text-slate-500 tracking-[0.15em] ml-0.5 flex items-center gap-1.5 transition-colors group-focus-within:text-blue-500">
                <Phone size={10} /> Authorized Terminal (Phone)
              </label>
              <input
                type="text"
                required
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded text-[11px] font-bold dark:text-white outline-none focus:ring-1 focus:ring-blue-600/40 focus:border-blue-600/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded font-black uppercase text-[9px] tracking-[0.2em] shadow-lg hover:shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={12} />
              ) : (
                <Save size={12} />
              )}
              Update Registry
            </button>
          </div>
        </form>
      </div>

      {/* --- Mini Info Panel --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-blue-600/10 rounded text-blue-500">
            <Fingerprint size={14} />
          </div>
          <div>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
              Biometric Identity
            </p>
            <p className="text-[9px] font-bold dark:text-slate-300 uppercase">
              Encrypted Handshake Active
            </p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-3 rounded-lg flex items-center gap-3">
          <div className="p-2 bg-emerald-600/10 rounded text-emerald-500">
            <Globe size={14} />
          </div>
          <div>
            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">
              Session Security
            </p>
            <p className="text-[9px] font-bold dark:text-slate-300 uppercase">
              Node Verified: Dhaka-Node-01
            </p>
          </div>
        </div>
      </div>

      {/* --- Sleek Action Bar --- */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-2 text-slate-500">
          <ShieldAlert size={10} />
          <p className="text-[7px] font-bold uppercase tracking-widest italic opacity-60">
            System modification protocols are recorded for security audits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest">
            Node Status:
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[6px] font-black rounded uppercase">
            Online
          </span>
        </div>
      </div>
    </div>
  );
}
