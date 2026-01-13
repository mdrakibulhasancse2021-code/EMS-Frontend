/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  ShieldCheck,
  Cpu,
  Database,
  Globe,
  Users,
  Zap,
  Fingerprint,
  Code2,
  Workflow,
} from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500 font-sans pt-20">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-full"
          >
            <Rocket size={12} /> Behind the Protocol
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Engineering the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Workforce Dynamics
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
            EMS Pro is not just a management tool; it's a high-performance
            ecosystem designed to synchronize human potential with automated
            precision.
          </p>
        </div>
      </section>

      {/* --- SYSTEM ARCHITECTURE (BASED ON YOUR DIAGRAM) --- */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-2xl font-black dark:text-white uppercase tracking-tight mb-6">
                Our Core Architecture
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                Built on a robust 4-tier foundation, EMS Pro separates concerns
                to ensure unrivaled scalability and data integrity.
              </p>

              <div className="space-y-4">
                <ArchitectureItem
                  icon={<Globe size={18} />}
                  title="User Interface"
                  desc="Responsive Next.js edge-delivery for Admin, HR, and Staff."
                />
                <ArchitectureItem
                  icon={<Cpu size={18} />}
                  title="Application Logic"
                  desc="Node.js powered brain handling attendance and payroll protocols."
                />
                <ArchitectureItem
                  icon={<Database size={18} />}
                  title="Database Layer"
                  desc="MongoDB NoSQL structure for flexible and secure data storage."
                />
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[3rem] border border-blue-500/20 flex items-center justify-center p-8">
                <div className="relative w-full h-full border-2 border-dashed border-blue-500/30 rounded-[2rem] flex items-center justify-center animate-[spin_20s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-blue-500 shadow-xl">
                    <Fingerprint className="text-blue-500" size={32} />
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8 bg-white dark:bg-slate-950 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800">
                    <p className="text-3xl font-black text-blue-600">100%</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Security Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SDLC PHASES (BASED ON YOUR FLOW CHART) --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black dark:text-white uppercase tracking-tighter">
              The Development DNA
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 uppercase tracking-[0.3em]">
              Built with SDLC Methodology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PhaseCard
              num="01"
              title="Requirement Analysis"
              desc="Deep diving into corporate bottlenecks to engineer custom-fit solutions."
            />
            <PhaseCard
              num="02"
              title="System Development"
              desc="Agile coding sprints using the latest tech stack for high-performance nodes."
            />
            <PhaseCard
              num="03"
              title="Deployment & Sync"
              desc="Live cloud integration with Asia/Dhaka timezone synchronization."
            />
          </div>
        </div>
      </section>

      {/* --- VISION STATEMENT --- */}
      <section className="py-24 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10 rotate-12">
          <Workflow size={300} />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-8 italic">
            "To eliminate administrative friction and empower every employee
            with digital transparency."
          </h2>
          <div className="w-16 h-1 bg-white/30 mx-auto rounded-full mb-8" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-70">
            Official System Vision 2026
          </p>
        </div>
      </section>

      {/* --- FOOTER STATUS --- */}
      <footer className="py-10 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Rocket size={16} />
            </div>
            <span className="text-sm font-black dark:text-white uppercase tracking-tighter">
              EMS<span className="text-blue-600">PRO</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Node: Dhaka_V2</span>
            <span>Uptime: 99.9%</span>
            <span>v2.0.4-Stable</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ArchitectureItem({ icon, title, desc }: any) {
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500/50 transition-all group">
      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 group-hover:text-blue-500 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black dark:text-slate-200 uppercase tracking-wide">
          {title}
        </h4>
        <p className="text-[11px] text-slate-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function PhaseCard({ num, title, desc }: any) {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
      <div className="text-5xl font-black text-blue-600/10 absolute -top-2 -left-2 group-hover:text-blue-600/20 transition-colors">
        {num}
      </div>
      <div className="relative z-10">
        <h3 className="text-sm font-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap size={14} className="text-blue-600" /> {title}
        </h3>
        <p className="text-[12px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}
