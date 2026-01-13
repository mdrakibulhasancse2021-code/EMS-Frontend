/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Rocket,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
                <Rocket size={22} />
              </div>
              <span className="text-xl font-black text-white tracking-tighter uppercase">
                EMS<span className="text-blue-500">Pro</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed text-slate-400 font-medium">
              The ultimate workforce management solution for modern enterprises.
              Streamline attendance, payroll, and tasks with automated
              precision.
            </p>
            {/* Social Icons with Your Real Links */}
            <div className="flex gap-3">
              <SocialIcon
                icon={<Facebook size={18} />}
                href="https://www.facebook.com/share/16r9L3UUwk/"
              />
              <SocialIcon
                icon={<Linkedin size={18} />}
                href="https://www.linkedin.com/in/md-rakibul-hassan-a027a4389"
              />
              <SocialIcon
                icon={<Github size={18} />}
                href="https://github.com/mdrakibulhasancse2021-code"
              />
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
              Internal Nodes
            </h4>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-widest">
              <li>
                <FooterLink href="#features" label="Features" />
              </li>
              <li>
                <FooterLink href="#solutions" label="Solutions" />
              </li>
              <li>
                <FooterLink href="/about" label="About Systems" />
              </li>
              <li>
                <FooterLink href="#pricing" label="Licensing" />
              </li>
            </ul>
          </div>

          {/* Module Links */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
              Active Modules
            </h4>
            <ul className="space-y-4 text-[12px] font-bold uppercase tracking-widest">
              <li>
                <FooterLink href="#" label="Attendance Node" />
              </li>
              <li>
                <FooterLink href="#" label="Payroll Engine" />
              </li>
              <li>
                <FooterLink href="#" label="Task Orchestrator" />
              </li>
              <li>
                <FooterLink href="#" label="Leave Registry" />
              </li>
            </ul>
          </div>

          {/* Contact Section with Your Real Location */}
          <div className="space-y-6">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-2">
              Security Contact
            </h4>
            <div className="space-y-4">
              <a
                href="mailto:md.rakibulhasancse2021@gmail"
                className="flex items-center gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Mail size={16} />
                </div>
                <span className="text-xs font-bold tracking-tight">
                  md.rakibulhasancse2021@gmail
                </span>
              </a>
              <div className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="text-xs font-bold leading-tight mt-1">
                  <span>Kotbari, Comilla</span>
                  <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">
                    Bangladesh Node
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              © {currentYear} EMS Pro Inc. Security Protocol Active.
            </p>
            <p className="text-[9px] text-slate-600 uppercase font-bold">
              Developed by{" "}
              <span className="text-blue-600/80">Md. Rakibul Hassan</span>
            </p>
          </div>

          <div className="flex gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
            <Link href="#" className="hover:text-blue-500 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">
              Audit
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-slate-400 hover:text-blue-500 flex items-center gap-1 group transition-all"
    >
      <ArrowRight
        size={10}
        className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all"
      />
      {label}
    </Link>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all transform hover:-translate-y-1 shadow-lg"
    >
      {icon}
    </a>
  );
}
