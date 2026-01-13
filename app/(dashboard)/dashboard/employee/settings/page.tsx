/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Phone,
  ShieldCheck,
  Loader2,
  Save,
  Briefcase,
  BadgeCheck,
  Building2,
  Wallet,
  Cpu,
  Fingerprint,
  AlertCircle,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/auth";

export default function MySettings() {
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    fetchMyProfile();
  }, []);

  const fetchMyProfile = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { data } = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });

      setUserProfile(data);
      setFormData({ name: data.name, phone: data.phone });
    } catch (error) {
      toast.error("Fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const { data } = await axios.put(`${API_URL}/profile/update`, formData, {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });

      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...data }));
      toast.success("Identity Updated");
      fetchMyProfile();
    } catch (error: any) {
      toast.error("Update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

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
              Identity Control Console
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
              <Fingerprint size={11} className="text-blue-500" /> Authorized
              Terminal: UID-{userProfile?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 rounded-md border-[1px] border-emerald-500/20 flex items-center gap-2">
          <ShieldCheck size={11} className="text-emerald-500" />
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
            Secure Session Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* --- Identity Form (Compact Module) --- */}
        <div className="lg:col-span-5">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <User size={16} />
              </div>
              <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest">
                Registry Management
              </h3>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Full Legal Designation
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[11px] font-bold dark:text-white outline-none transition-all shadow-sm"
                    placeholder="System Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                  Contact Terminal (Phone)
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-[1px] border-transparent focus:border-blue-500/40 rounded-lg text-[11px] font-bold dark:text-white outline-none transition-all shadow-sm"
                    placeholder="Terminal ID"
                  />
                </div>
              </div>

              <button
                disabled={updateLoading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {updateLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Commit Updates
              </button>
            </form>
          </section>
        </div>

        {/* --- Details Section (Refined Grid) --- */}
        <div className="lg:col-span-7">
          <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Briefcase size={16} />
              </div>
              <h3 className="text-[11px] font-black dark:text-white uppercase tracking-widest">
                Professional Protocol
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              <InfoBox
                label="Designation"
                value={userProfile?.designation}
                icon={<BadgeCheck size={18} />}
                color="text-purple-500"
              />
              <InfoBox
                label="Department"
                value={userProfile?.department}
                icon={<Building2 size={18} />}
                color="text-emerald-500"
              />
              <InfoBox
                label="System Role"
                value={userProfile?.role}
                icon={<ShieldCheck size={18} />}
                color="text-blue-500"
              />
              <InfoBox
                label="Base Salary"
                value={`৳ ${userProfile?.baseSalary?.toLocaleString()}`}
                icon={<Wallet size={18} />}
                color="text-amber-500"
              />
            </div>

            <div className="mt-6 p-4 bg-amber-500/5 rounded-lg border-[1px] border-amber-500/10 flex items-start gap-3">
              <AlertCircle
                className="text-amber-500 shrink-0 mt-0.5"
                size={16}
              />
              <p className="text-[9px] font-bold text-amber-700 dark:text-amber-500/70 uppercase leading-relaxed tracking-wider">
                System Alert: Official professional credentials and financial
                architecture are managed strictly by central administration.
                Contact HQ for modification requests.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon, color }: any) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border-[1px] border-slate-100 dark:border-slate-800/80 group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm">
      <div
        className={`${color} opacity-80 shrink-0 transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-1">
          {label}
        </p>
        <p className="text-[12px] font-black dark:text-white uppercase truncate">
          {value || "Pending Registry"}
        </p>
      </div>
    </div>
  );
}
