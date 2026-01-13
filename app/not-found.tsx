/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Cpu, Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center p-6 transition-colors duration-500 font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-600 border border-blue-600/20 shadow-2xl">
              <Ghost size={48} className="animate-bounce" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-rose-600 rounded-xl text-white shadow-lg">
              <ShieldAlert size={16} />
            </div>
          </div>

          <h1 className="text-7xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
            4<span className="text-blue-600">0</span>4
          </h1>
          <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mb-6">
            Node Not Found In Registry
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl mb-8">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              The requested protocol address does not exist or has been moved to
              a restricted sector.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Back to Entry
            </Link>
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
              <Cpu size={18} className="text-blue-500 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Sys_v2.0.4
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
