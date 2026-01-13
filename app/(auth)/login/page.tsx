"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  UserCircle,
  Briefcase,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    login(phone, password);
  };

  // ১-ক্লিক অটো লগইন ফাংশন
  const autoLogin = (p: string, pass: string) => {
    setPhone(p);
    setPassword(pass);
    // স্টেট আপডেটের জন্য সামান্য বিলম্ব দিয়ে সরাসরি লগইন কল করা
    setTimeout(() => {
      login(p, pass);
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#020617] p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Blobs - Refined for Dark Mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Rocket size={20} />
            </div>
          </Link>
          <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Security Gate
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Authorization Required
          </p>
        </div>

        {/* Login Card - Enhanced Contrast for Dark Mode */}
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-xl flex items-center gap-2"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 ml-1">
                Phone Node
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  Access Key
                </label>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={16}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Verify & Enter{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center mb-3">
              One-Click Protocol Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => autoLogin("01405671742", "123")}
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-slate-200 dark:border-slate-800 rounded-lg transition-all text-left"
              >
                <ShieldCheck size={14} className="text-blue-600" />
                <div className="leading-none">
                  <p className="text-[8px] font-black uppercase dark:text-white">
                    Admin
                  </p>
                  <p className="text-[6px] text-slate-500 mt-0.5">
                    Master Node
                  </p>
                </div>
              </button>
              <button
                onClick={() => autoLogin("01811223344", "123")}
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-800 rounded-lg transition-all text-left"
              >
                <Briefcase size={14} className="text-emerald-600" />
                <div className="leading-none">
                  <p className="text-[8px] font-black uppercase dark:text-white">
                    HR
                  </p>
                  <p className="text-[6px] text-slate-500 mt-0.5">
                    Registry Node
                  </p>
                </div>
              </button>
              <button
                onClick={() => autoLogin("01955667788", "123")}
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 border border-slate-200 dark:border-slate-800 rounded-lg transition-all text-left"
              >
                <UserCircle size={14} className="text-amber-600" />
                <div className="leading-none">
                  <p className="text-[8px] font-black uppercase dark:text-white">
                    Staff 1
                  </p>
                  <p className="text-[6px] text-slate-500 mt-0.5">Unit Entry</p>
                </div>
              </button>
              <button
                onClick={() => autoLogin("01405671741", "123")}
                className="flex items-center gap-3 p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-slate-200 dark:border-slate-800 rounded-lg transition-all text-left"
              >
                <Terminal size={14} className="text-indigo-600" />
                <div className="leading-none">
                  <p className="text-[8px] font-black uppercase dark:text-white">
                    Staff 2
                  </p>
                  <p className="text-[6px] text-slate-500 mt-0.5">Dev Entry</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <p className="text-center mt-6 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400">
          SYSTEM VERSION <span className="text-blue-600">2.0.4-LATEST</span>
        </p>
      </motion.div>
    </div>
  );
}
