/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Rocket,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "Admin":
        return "/dashboard/admin";
      case "HR":
        return "/dashboard/hr";
      case "Manager":
        return "/dashboard/manager";
      case "Employee":
        return "/dashboard/employee";
      default:
        return "/dashboard";
    }
  };

  // ডাইনামিক সেটিংস পাথ জেনারেটর
  const getSettingsPath = () => {
    if (!user) return "/login";
    const basePath = getDashboardPath();
    return `${basePath}/settings`;
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-[100] py-3 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group relative z-[110]"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-300">
              <Rocket size={22} />
            </div>
            <span className="text-xl font-black tracking-tighter dark:text-white uppercase">
              EMS<span className="text-blue-600 ml-0.5">PRO</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <Link
              href="#features"
              className="hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#solutions"
              className="hover:text-blue-600 transition-colors"
            >
              Solutions
            </Link>
            <div className="relative group/drop cursor-pointer flex items-center gap-1 hover:text-blue-600 transition-all">
              Resources <ChevronDown size={12} />
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/drop:opacity-100 group-hover/drop:visible transition-all duration-200">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-xl p-2 w-48">
                  <div className="p-3 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer uppercase font-black">
                    Documentation
                  </div>
                  <div className="p-3 text-[10px] hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg cursor-pointer uppercase font-black">
                    System Support
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
              >
                Portal Access
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardPath()}
                  className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-2"
                >
                  <User size={14} /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2.5 bg-slate-100 dark:bg-slate-900 text-slate-400 hover:text-red-500 rounded-xl transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-[110] p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white active:scale-90 transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={22} className="text-blue-600" />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </nav>

      {/* --- Optimized Mobile Sidebar --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[150] md:hidden"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              style={{ touchAction: "none" }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[300px] bg-white dark:bg-slate-950 z-[160] shadow-2xl border-l border-slate-100 dark:border-slate-800 md:hidden flex flex-col will-change-transform"
            >
              {/* Profile Section */}
              <div className="p-6 pt-24 border-b border-slate-50 dark:border-slate-900/50">
                {user ? (
                  <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-600 border border-blue-600/20">
                      <User size={24} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-black dark:text-white uppercase truncate">
                        {user.name}
                      </p>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                        {user.role}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Guest Mode
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 opacity-50">
                  Navigation
                </p>
                <MobileNavLink
                  href="#features"
                  icon={<Zap size={18} />}
                  label="Core Features"
                  onClick={() => setIsOpen(false)}
                />
                <MobileNavLink
                  href="#solutions"
                  icon={<ShieldCheck size={18} />}
                  label="Solutions"
                  onClick={() => setIsOpen(false)}
                />
                <MobileNavLink
                  href={getDashboardPath()}
                  icon={<LayoutDashboard size={18} />}
                  label="Dashboard"
                  onClick={() => setIsOpen(false)}
                />
                <MobileNavLink
                  href={getSettingsPath()}
                  icon={<Settings size={18} />}
                  label="Settings"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              {/* Bottom Action */}
              <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                {!user ? (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    System Login <ArrowRight size={16} />
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-rose-500/20 active:scale-95"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileNavLink({ href, label, icon, onClick }: any) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl active:bg-slate-100 dark:active:bg-slate-900 transition-colors group"
    >
      <div className="text-slate-400 group-active:text-blue-600 transition-colors">
        {icon}
      </div>
      <span className="text-[13px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight group-active:text-blue-600">
        {label}
      </span>
    </Link>
  );
}
