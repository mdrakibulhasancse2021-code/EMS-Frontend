/* eslint-disable react-hooks/purity */
"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Wallet,
  ListChecks,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";

interface Feature {
  icon: JSX.Element;
  title: string;
  desc: string;
  stats: string;
  color: string;
}

const features: Feature[] = [
  {
    icon: <Calendar size={18} />,
    title: "Smart Attendance",
    desc: "Real-time geofencing & biometric syncing.",
    stats: "99.9% Up",
    color: "text-blue-500",
  },
  {
    icon: <Wallet size={18} />,
    title: "Auto Payroll",
    desc: "Instant salary & tax calculations.",
    stats: "Zero Error",
    color: "text-emerald-500",
  },

  {
    icon: <ShieldCheck size={18} />,
    title: "Leave System",
    desc: "One-click digital approval flow.",
    stats: "2x Faster",
    color: "text-amber-500",
  },
  {
    icon: <BarChart3 size={18} />,
    title: "BI Analytics",
    desc: "Deep-dive predictive team insights.",
    stats: "360° View",
    color: "text-indigo-500",
  },
  {
    icon: <Users size={18} />,
    title: "Team Hub",
    desc: "Org-wide scheduling & monitoring.",
    stats: "5k+ Teams",
    color: "text-rose-500",
  },
  {
    icon: <Clock size={18} />,
    title: "Time Tracker",
    desc: "Project-level precision tracking.",
    stats: "High Acc.",
    color: "text-teal-500",
  },
];

export default function Features(): JSX.Element {
  return (
    <section
      id="features"
      className="relative py-20 bg-white dark:bg-slate-950 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header - Compact Style */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-slate-100 dark:border-slate-900 pb-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400"
            >
              <div className="w-4 h-[1.5px] bg-blue-600"></div>
              Core Modules
            </motion.div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Enterprise Ecosystem <br />
              <span className="opacity-40">Built for High Performance</span>
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-[320px] leading-relaxed">
            Optimizing every touchpoint of workforce management into a single,
            intelligent interface.
          </p>
        </div>

        {/* Features Grid - More Compact Gap */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group p-6 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                {/* Icon & Stats Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-2.5 bg-white dark:bg-slate-800 rounded-lg shadow-sm ${f.color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {f.icon}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter px-2 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
                    {f.stats}
                  </span>
                </div>

                {/* Content - Compact Typography */}
                <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-6">
                  {f.desc}
                </p>

                {/* Bottom Action - Subtle */}
                <div className="mt-auto pt-4 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors cursor-pointer">
                  Explore Module{" "}
                  <ArrowRight
                    size={10}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Minimalist Footer Stat */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 dark:text-slate-800"
        >
          Trusted by 5000+ teams globally
        </motion.div>
      </div>
    </section>
  );
}
