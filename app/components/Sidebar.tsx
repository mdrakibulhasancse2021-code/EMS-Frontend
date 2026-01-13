/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Rocket,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  CheckSquare,
  Clock,
  FileText,
  Gift,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar({
  isMobileButton = false,
}: {
  isMobileButton?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menuConfig: any = {
    Admin: [
      {
        name: "Admin Home",
        icon: <LayoutDashboard size={18} />,
        path: "/dashboard/admin",
      },
      {
        name: "Staff Management",
        icon: <Users size={18} />,
        path: "/dashboard/admin/staff-management",
      },
      {
        name: "Live Attendance",
        icon: <Clock size={18} />,
        path: "/dashboard/admin/attendance",
      },
      {
        name: "Leave Requests",
        icon: <FileText size={18} />,
        path: "/dashboard/admin/leaves",
      },
      {
        name: "Payroll Center",
        icon: <CreditCard size={18} />,
        path: "/dashboard/admin/payroll",
      },
      {
        name: "Bonus & Incentives",
        icon: <Gift size={18} />,
        path: "/dashboard/admin/bonuses",
      },
      {
        name: "Tasks Overview",
        icon: <CheckSquare size={18} />,
        path: "/dashboard/admin/tasks",
      },
      {
        name: "System Logs",
        icon: <ShieldAlert size={18} />,
        path: "/dashboard/admin/logs",
      },
      {
        name: "Settings",
        icon: <Settings size={18} />,
        path: "/dashboard/admin/settings",
      },
    ],
    HR: [
      {
        name: "HR Dashboard",
        icon: <LayoutDashboard size={18} />,
        path: "/dashboard/hr",
      },
      {
        name: "Employee Directory",
        icon: <Users size={18} />,
        path: "/dashboard/hr/staff",
      },
      {
        name: "Attendance Logs",
        icon: <Clock size={18} />,
        path: "/dashboard/hr/attendance",
      },
      {
        name: "Leave Registry",
        icon: <FileText size={18} />,
        path: "/dashboard/hr/leaves",
      },
      {
        name: "Payroll Management",
        icon: <CreditCard size={18} />,
        path: "/dashboard/hr/payroll",
      },
      {
        name: "My Settings",
        icon: <Settings size={18} />,
        path: "/dashboard/hr/settings",
      },
    ],
    // ✅ Employee Role Added
    Employee: [
      {
        name: "My Dashboard",
        icon: <LayoutDashboard size={18} />,
        path: "/dashboard/employee",
      },
      {
        name: "Work Attendance",
        icon: <Clock size={18} />,
        path: "/dashboard/employee/my-attendance",
      },
      {
        name: "My Tasks",
        icon: <ClipboardList size={18} />, // আপনি এটি ইমপোর্ট করে নিন বা CheckSquare ব্যবহার করুন
        path: "/dashboard/employee/tasks",
      },
      {
        name: "Apply Leave",
        icon: <FileText size={18} />,
        path: "/dashboard/employee/leaves",
      },
      {
        name: "My Settings",
        icon: <Settings size={18} />,
        path: "/dashboard/employee/settings",
      },
    ],
  };

  const currentMenuItems = user?.role ? menuConfig[user.role] : [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#020617] text-slate-600 dark:text-slate-400 transition-colors duration-300 shadow-2xl overflow-hidden">
      {/* Header Inside Sidebar */}
      <div className="h-16 shrink-0 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#020617]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <Rocket size={18} />
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white uppercase italic">
            EMS Pro
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Scrollable */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
        <div className="px-3 mb-4 mt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Main Menu
          </p>
        </div>
        {currentMenuItems?.map((item: any, idx: number) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={idx}
              href={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group ${
                isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-blue-600 dark:hover:text-slate-100"
              }`}
            >
              <span
                className={
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }
              >
                {item.icon}
              </span>
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Inside Sidebar */}
      <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#020617]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3.5 px-3 py-3 bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-800/50 mb-3">
          <div className="shrink-0 w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-black text-slate-900 dark:text-white truncate uppercase">
              {user?.name || "Member"}
            </p>
            <p className="text-[8px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-500">
              {user?.role || "Staff"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
        >
          <LogOut size={16} /> Secure Logout
        </button>
      </div>
    </div>
  );

  if (isMobileButton) {
    return (
      <>
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between w-full h-16 px-4 bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
          <Link
            href="/"
            className="flex items-center gap-2 active:scale-95 transition-all"
          >
            <Rocket size={18} className="text-blue-600" />
            <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight uppercase italic">
              EMS PRO
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white active:scale-95 transition-all shadow-sm"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* সাইডবার ড্রয়ার পোর্টাল - একদম ফিক্সড এবং স্ক্রিন জোড়া */}
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] lg:hidden h-screen overflow-hidden">
              {/* অন্ধকার ব্যাকড্রপ - হাইট h-screen দিয়ে স্ক্রিন লক করা */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-md h-screen"
              />

              {/* স্লাইডিং সাইডবার বডি - হাইট h-full এবং fixed পজিশন */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-y-0 left-0 w-72 h-full bg-white dark:bg-[#020617] shadow-2xl border-r border-slate-200 dark:border-slate-800"
              >
                <SidebarContent />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return <SidebarContent />;
}
