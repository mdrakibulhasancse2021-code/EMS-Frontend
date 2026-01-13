/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Bell, Search, User, ChevronDown, Calendar } from "lucide-react";

export default function DashboardNavbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    // এখানে hidden সরিয়ে দেওয়া হয়েছে যাতে লেআউট ফাইল থেকে এটি বড় স্ক্রিনে কাজ করে
    <nav className="flex h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-md sticky top-0 z-40 px-6 items-center justify-between transition-colors duration-500 w-full">
      {/* Left: Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 w-72">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search records..."
          className="bg-transparent text-xs font-medium focus:outline-none text-slate-600 dark:text-slate-300 w-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      {/* Right: User Info & Actions */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50">
          <Calendar size={14} className="text-blue-600 dark:text-blue-400" />
          <span className="text-[10px] font-black uppercase tracking-tight text-blue-600 dark:text-blue-400">
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Notifications */}
        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#020617]" />
        </button>

        <div className="h-8 w-px bg-slate-100 dark:bg-slate-800 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 dark:text-white leading-none mb-1">
              {user?.name || "Loading..."}
            </p>
            <p className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
              {user?.role || "User"}
            </p>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <User size={18} />
          </div>
          <ChevronDown
            size={14}
            className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors"
          />
        </div>
      </div>
    </nav>
  );
}
