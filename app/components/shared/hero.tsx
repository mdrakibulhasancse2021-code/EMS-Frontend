/* eslint-disable react-hooks/purity */
"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  MousePointer2,
} from "lucide-react";
import Link from "next/link";

export default function Hero(): JSX.Element {
  return (
    <section className="relative pt-28 md:pt-36 pb-20 px-6 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* --- SUBTLE BACKGROUND ARCHITECTURE --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Minimalist Ambient Glows */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 dark:bg-blue-900/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-[-5%] w-[35%] h-[35%] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full blur-[100px]"
        />

        {/* Micro-Grid Pattern - Professional look */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* --- COMPACT STATUS BADGE --- */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-[9px] font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100/50 dark:border-blue-800/30 rounded-full"
        >
          <Sparkles size={10} className="animate-pulse" />
          <span>Workforce Intelligence v2.0</span>
        </motion.div>

        {/* --- REFINED SMALLER HEADLINE --- */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]"
        >
          Everything your team needs to work
          <br />
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600">
            better, faster, and together.
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-1 left-0 h-[4px] bg-blue-500/10 -z-10 rounded-full"
            />
          </span>
        </motion.h1>

        {/* --- COMPACT SUBTEXT --- */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mb-8 max-w-lg mx-auto leading-relaxed font-medium"
        >
          An integrated ecosystem to automate attendance, payroll, and tasks.
          Built for high-performance teams who prioritize precision.
        </motion.p>

        {/* --- STATS / TRUST INDICATORS --- */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 mb-10"
        >
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
            <span>99.9% Uptime</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <ShieldCheck size={12} className="text-blue-500" />
            <span>Enterprise Security</span>
          </div>
          <div className="hidden sm:block w-px h-3 bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
            <Zap size={12} className="text-amber-500" />
            <span>500+ Active Teams</span>
          </div>
        </motion.div>

        {/* --- ACTION CLUSTER --- */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <Link
            href="/login"
            className="group relative px-6 py-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 overflow-hidden"
          >
            Launch System
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          <button className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2">
            <MousePointer2 size={12} className="text-blue-500" /> Book Demo
          </button>
        </motion.div>
      </div>
    </section>
  );
}
