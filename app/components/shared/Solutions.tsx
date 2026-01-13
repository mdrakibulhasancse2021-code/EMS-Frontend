/* eslint-disable react-hooks/purity */
"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  Users,
  UserCheck,
  BarChart,
  Cpu,
  Database,
  Globe,
  ArrowUpRight,
  Fingerprint,
} from "lucide-react";

interface Role {
  title: string;
  text: string;
  icon: JSX.Element;
  color: string;
  features: string[];
  delay: number;
}

const roles: Role[] = [
  {
    title: "System Admin",
    text: "Master node control for global security, salary protocols, and audit logs.",
    icon: <Shield size={18} />,
    color: "from-blue-600 to-indigo-600",
    features: ["Global Security", "Audit Tracking"],
    delay: 0.1,
  },
  {
    title: "HR Registry",
    text: "Streamlined personnel management, attendance oversight, and payroll sync.",
    icon: <Users size={18} />,
    color: "from-emerald-600 to-teal-600",
    features: ["Staff Logs", "Payroll Sync"],
    delay: 0.2,
  },
  {
    title: "Dept Managers",
    text: "Strategic team orchestration, task delegation, and performance analytics.",
    icon: <UserCheck size={18} />,
    color: "from-amber-600 to-orange-600",
    features: ["Task Control", "Leave Review"],
    delay: 0.3,
  },
  {
    title: "Employees",
    text: "Self-service portal for clock-in, task status, and real-time payslips.",
    icon: <Zap size={18} />,
    color: "from-purple-600 to-pink-600",
    features: ["Smart Clock-in", "Payslips"],
    delay: 0.4,
  },
];

export default function Solutions(): JSX.Element {
  return (
    <section className="relative py-24 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500 font-sans">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-full"
          >
            <Fingerprint size={12} className="animate-pulse" />
            System Architecture & Roles
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
            Integrated Ecosystem for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Modern Governance
            </span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">
            Deploying a 4-tier architecture designed to bridge the gap between
            User Experience and complex Business Logic.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* --- LEFT SIDE: THE ARCHITECTURAL MOCKUP --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Architectural Stack Visualization */}
            <div className="relative space-y-4">
              {/* UI Layer */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 group hover:border-blue-500/50 transition-all">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Tier 1: User Interface
                  </p>
                  <p className="text-sm font-bold dark:text-slate-200 uppercase">
                    React & Next.js Framework
                  </p>
                </div>
                <ArrowUpRight className="ml-auto opacity-20 group-hover:opacity-100 transition-all text-blue-500" />
              </div>

              {/* Logic Layer */}
              <div className="ml-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 group hover:border-emerald-500/50 transition-all">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Tier 2: Business Logic
                  </p>
                  <p className="text-sm font-bold dark:text-slate-200 uppercase">
                    Node.js API Services
                  </p>
                </div>
                <ArrowUpRight className="ml-auto opacity-20 group-hover:opacity-100 transition-all text-emerald-500" />
              </div>

              {/* Database Layer */}
              <div className="ml-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xl flex items-center gap-4 group hover:border-amber-500/50 transition-all">
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                  <Database size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                    Tier 3: Database Engine
                  </p>
                  <p className="text-sm font-bold dark:text-slate-200 uppercase">
                    MongoDB NoSQL Schema
                  </p>
                </div>
                <ArrowUpRight className="ml-auto opacity-20 group-hover:opacity-100 transition-all text-amber-500" />
              </div>
            </div>

            {/* Floating Connection Line */}
            <div className="absolute left-6 top-10 bottom-10 w-[2px] bg-gradient-to-b from-blue-500 via-emerald-500 to-amber-500 opacity-20" />
          </motion.div>

          {/* --- RIGHT SIDE: ROLE CARDS --- */}
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {roles.map((role, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: role.delay }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative p-5 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl hover:bg-white dark:hover:bg-slate-900 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-[14px] font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">
                    {role.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-4">
                    {role.text}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {role.features.map((f, i) => (
                      <span
                        key={i}
                        className="text-[8px] font-black uppercase tracking-widest text-blue-600/70 dark:text-blue-400/70"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Performance Metrics Stats Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="p-6 bg-slate-900 dark:bg-blue-600 rounded-[2rem] text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <BarChart size={80} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center relative z-10">
                <div>
                  <div className="text-xl font-black tracking-tighter">
                    0.2s
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">
                    API Response
                  </div>
                </div>
                <div className="border-x border-white/10">
                  <div className="text-xl font-black tracking-tighter">
                    100%
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">
                    Data Integrity
                  </div>
                </div>
                <div>
                  <div className="text-xl font-black tracking-tighter">
                    Dhaka
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest opacity-70">
                    Sync Node
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
