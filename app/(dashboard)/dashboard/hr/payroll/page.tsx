/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  CreditCard,
  Search,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  Cpu,
  Fingerprint,
  Info,
  Zap,
  CalendarDays,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function HRPayrollOverview() {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchCombinedPayroll(user.token);
    }
  }, []);

  const fetchCombinedPayroll = async (authToken: string) => {
    setLoading(true);
    try {
      // ১. সব ইউজার আনা হচ্ছে (Base Salary এর জন্য)
      const usersRes = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // ২. জেনারেট হওয়া সব পে-রোল রেকর্ড আনা হচ্ছে
      const payrollRes = await axios.get(`${API_URL}/payroll/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const payrolls = Array.isArray(payrollRes.data) ? payrollRes.data : [];

      // ৩. ডাটা কম্বাইন করা (ইউজার + তাদের লেটেস্ট পে-রোল রেকর্ড)
      const combined = users.map((user: any) => {
        const latestPayroll = payrolls.find(
          (p: any) => p.employee?._id === user._id
        );
        return {
          ...user,
          payrollInfo: latestPayroll || null,
        };
      });

      setPayrollData(combined);
    } catch (error) {
      toast.error("Financial synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  // --- CSV ডাউনলোড লজিক ---
  const downloadPayrollCSV = () => {
    if (payrollData.length === 0) {
      toast.warning("No data available to export");
      return;
    }

    const headers = [
      "Employee,Month,Base Salary,Bonus,Deductions,Net Payable,Status\n",
    ];
    const rows = payrollData.map((item) => {
      const p = item.payrollInfo;
      const totalDeduction = p
        ? p.deductions?.attendance + p.deductions?.tasks
        : 0;
      const month = p?.month || "Unprocessed";
      const net = p?.netPayable || item.baseSalary;
      return `${item.name},${month},${item.baseSalary},${
        p?.totalBonus || 0
      },${totalDeduction},${net},${p?.status || "Unpaid"}\n`;
    });

    const csvContent = headers.concat(rows).join("");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute(
      "download",
      `Payroll_Audit_Log_${new Date().toLocaleDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Audit log downloaded successfully");
  };

  const filteredData = payrollData.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6 transition-all duration-300">
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        style={{ marginTop: "75px" }}
      />

      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#020617] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border border-blue-600/20">
            <CreditCard size={24} />
          </div>
          <div>
            <h1 className="text-[15px] font-black dark:text-white uppercase tracking-wider leading-none">
              Remuneration Audit
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <Fingerprint size={12} className="text-blue-500" /> HR Terminal •
              Verification Mode
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchCombinedPayroll(token)}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 transition-all"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={downloadPayrollCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
          >
            <Download size={16} /> Export Records
          </button>
        </div>
      </div>

      {/* --- Search --- */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <input
          type="text"
          placeholder="Identify unit by personnel name or department..."
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- Table --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-black">
              <tr>
                <th className="p-5 text-[9px] tracking-widest">
                  Personnel & Month
                </th>
                <th className="p-5 text-[9px] tracking-widest text-center">
                  Standard Base
                </th>
                <th className="p-5 text-[9px] tracking-widest text-center">
                  Net Adjustments
                </th>
                <th className="p-5 text-[9px] tracking-widest text-right">
                  Final Payable
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-blue-600/5 transition-all group"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center font-black text-blue-600 text-[11px] uppercase">
                          {item.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[13px] font-bold text-slate-900 dark:text-slate-200 tracking-tight">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-blue-500 font-black uppercase flex items-center gap-1 mt-0.5">
                            <CalendarDays size={10} />{" "}
                            {item.payrollInfo?.month || "Not Calculated"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <p className="text-[12px] font-black text-slate-600 dark:text-slate-400">
                        ৳{item.baseSalary?.toLocaleString()}
                      </p>
                    </td>
                    <td className="p-5 text-center">
                      {item.payrollInfo ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[8px] font-black uppercase text-emerald-500 flex items-center gap-1">
                            <Zap size={10} /> +৳{item.payrollInfo.totalBonus}
                          </span>
                          <span className="text-[8px] font-black uppercase text-rose-500 flex items-center gap-1">
                            <AlertCircle size={10} /> -৳
                            {item.payrollInfo.deductions.attendance +
                              item.payrollInfo.deductions.tasks}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[8px] font-black uppercase text-slate-400">
                          Awaiting Batch Process
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end leading-none">
                        <span className="text-[13px] font-black text-blue-600 dark:text-blue-400">
                          ৳
                          {item.payrollInfo
                            ? item.payrollInfo.netPayable?.toLocaleString()
                            : item.baseSalary?.toLocaleString()}
                        </span>
                        <span
                          className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border mt-1.5 tracking-tighter ${
                            item.payrollInfo?.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                              : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                          }`}
                        >
                          {item.payrollInfo?.status || "Pending"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Audit Footer --- */}
      <div className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl flex items-start gap-3">
        <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
        <p className="text-[9px] font-medium text-blue-600 dark:text-blue-400 leading-relaxed uppercase tracking-widest">
          Audit Protocol: Net payable calculations are based on approved leaves,
          attendance penalties (0.25/day), and task-based deductions (500/task).
          Final disbursement requires Admin tier authentication.
        </p>
      </div>
    </div>
  );
}
