/* eslint-disable react-hooks/purity */
"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Users2, CheckCircle, Globe2, Zap } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: JSX.Element;
  desc: string;
}

const stats: Stat[] = [
  {
    label: "Active Users",
    value: "10K+",
    icon: <Users2 size={16} />,
    desc: "Professionals managing daily workflows.",
  },
  {
    label: "Tasks Completed",
    value: "1.2M",
    icon: <CheckCircle size={16} />,
    desc: "Projects delivered on time via our platform.",
  },
  {
    label: "Global Clients",
    value: "500+",
    icon: <Globe2 size={16} />,
    desc: "Companies scaling with EMSPro.",
  },
  {
    label: "Process Speed",
    value: "2x",
    icon: <Zap size={16} />,
    desc: "Faster payroll and attendance processing.",
  },
];

export default function Stats(): JSX.Element {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group text-center lg:text-left"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2 text-blue-600 dark:text-blue-400">
                {stat.icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {stat.label}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
                {stat.value}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-tight max-w-[140px] mx-auto lg:mx-0">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* --- LOGO WALL / TRUSTED BY --- */}
        <div className="pt-10 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
            Trusted by Industry Leaders
          </span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {/* Replace with actual partner logos or text-based logos */}
            <span className="text-sm font-bold tracking-tighter text-slate-900 dark:text-white">
              MICROSOFT
            </span>
            <span className="text-sm font-bold tracking-tighter text-slate-900 dark:text-white">
              STRIPE
            </span>
            <span className="text-sm font-bold tracking-tighter text-slate-900 dark:text-white">
              AIRBNB
            </span>
            <span className="text-sm font-bold tracking-tighter text-slate-900 dark:text-white">
              VERCEL
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
