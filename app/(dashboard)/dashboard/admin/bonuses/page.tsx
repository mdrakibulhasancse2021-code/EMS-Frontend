/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  TrendingUp,
  Search,
  User,
  DollarSign,
  Send,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/admin";

export default function AdminIncentives() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [selectedEmp, setSelectedEmp] = useState<any>(null);
  const [bonusData, setBonusData] = useState({
    amount: "",
    reason: "",
    type: "Performance",
  });
  const [newSalary, setNewSalary] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchEmployees(user.token);
    }
  }, []);

  const fetchEmployees = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://ems-backend-sigma.vercel.app/api/auth/users`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setEmployees(data);
    } catch (error) {
      toast.error("Employee sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGiveBonus = async () => {
    if (!selectedEmp || !bonusData.amount || !bonusData.reason)
      return toast.warning("Missing fields");
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/give-bonus`,
        {
          employeeId: selectedEmp._id,
          amount: Number(bonusData.amount),
          reason: bonusData.reason,
          type: bonusData.type,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bonus awarded!");
      setBonusData({ amount: "", reason: "", type: "Performance" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // স্যালারি আপডেট ফিক্স লজিক
  const handleUpdateSalary = async () => {
    if (!selectedEmp || !newSalary) return toast.warning("Enter new salary");
    setIsSubmitting(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/update-salary/${selectedEmp._id}`,
        {
          baseSalary: Number(newSalary),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Salary upgraded!");

      // ফিক্স: সিলেক্টেড এমপ্লয়ির ডাটা লোকাল স্টেটে আপডেট করা যাতে স্ক্রিনে সাথে সাথে পরিবর্তন দেখা যায়
      setSelectedEmp({ ...selectedEmp, baseSalary: Number(newSalary) });

      // এমপ্লয়ি লিস্টও আপডেট করা
      setEmployees(
        employees.map((emp) =>
          emp._id === selectedEmp._id
            ? { ...emp, baseSalary: Number(newSalary) }
            : emp
        )
      );

      setNewSalary("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 space-y-5 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <ToastContainer theme="dark" autoClose={1500} />

      {/* Header Section */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Reward Engine
          </h1>
        </div>
        <button
          onClick={() => fetchEmployees(token)}
          className="p-2 text-slate-400 hover:text-blue-500 transition-all"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Directory List */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[400px] lg:h-[600px] overflow-hidden shadow-sm">
          <div className="p-3 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={14}
              />
              <input
                type="text"
                placeholder="Personnel lookup..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-[10px] font-bold outline-none text-slate-700 dark:text-slate-200 border border-transparent focus:border-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {loading ? (
              <div className="py-20 text-center">
                <Loader2 className="animate-spin inline text-blue-500" />
              </div>
            ) : (
              filteredEmployees.map((emp) => (
                <button
                  key={emp._id}
                  onClick={() => setSelectedEmp(emp)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border ${
                    selectedEmp?._id === emp._id
                      ? "bg-blue-50 dark:bg-blue-600/10 border-blue-200 dark:border-blue-800/50 shadow-sm"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${
                        selectedEmp?._id === emp._id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-blue-500"
                      }`}
                    >
                      {emp.name?.charAt(0)}
                    </div>
                    <div className="text-left min-w-0">
                      <p
                        className={`text-[11px] font-bold truncate ${
                          selectedEmp?._id === emp._id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-900 dark:text-slate-200"
                        }`}
                      >
                        {emp.name}
                      </p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase truncate">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={12}
                    className={
                      selectedEmp?._id === emp._id
                        ? "text-blue-500"
                        : "text-slate-300"
                    }
                  />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Action Console */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {selectedEmp ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                {/* Profile Banner - অটো আপডেট হবে এখানে */}
                <div className="bg-white dark:bg-[#0f172a] p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <User size={22} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-base font-black text-slate-900 dark:text-white truncate">
                        {selectedEmp.name}
                      </h2>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                        {selectedEmp.department || "General"} Dept.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800 w-full sm:w-auto text-center sm:text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Fixed Remuneration
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter italic">
                      ৳{selectedEmp.baseSalary?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white dark:bg-[#0f172a] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                      <Gift size={16} />{" "}
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                        Incentive Award
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase">
                          Amount (BDT)
                        </label>
                        <input
                          type="number"
                          value={bonusData.amount}
                          onChange={(e) =>
                            setBonusData({
                              ...bonusData,
                              amount: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-emerald-500/30 text-slate-900 dark:text-white shadow-inner"
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase">
                          Justification
                        </label>
                        <textarea
                          rows={2}
                          value={bonusData.reason}
                          onChange={(e) =>
                            setBonusData({
                              ...bonusData,
                              reason: e.target.value,
                            })
                          }
                          className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-emerald-500/30 text-slate-900 dark:text-white resize-none shadow-inner"
                          placeholder="Describe the reason..."
                        />
                      </div>
                      <button
                        onClick={handleGiveBonus}
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : (
                          <Send size={12} />
                        )}{" "}
                        Award Bonus
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-[#0f172a] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2 text-blue-500 mb-2">
                      <TrendingUp size={16} />{" "}
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">
                        Salary Migration
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase">
                          New Monthly Base
                        </label>
                        <input
                          type="number"
                          value={newSalary}
                          onChange={(e) => setNewSalary(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs font-bold outline-none border border-transparent focus:border-blue-500/30 text-slate-900 dark:text-white shadow-inner"
                          placeholder="Enter amount..."
                        />
                      </div>
                      <div className="p-3 bg-blue-50/50 dark:bg-blue-600/5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <p className="text-[8px] font-bold text-blue-600 dark:text-blue-400 leading-relaxed italic">
                          Updating will change the remuneration for all future
                          cycles.
                        </p>
                      </div>
                      <button
                        onClick={handleUpdateSalary}
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="animate-spin" size={12} />
                        ) : (
                          <ArrowUpRight size={12} />
                        )}{" "}
                        Deploy Increment
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-[#0f172a] rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 text-center shadow-inner">
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-4 shadow-sm">
                  <DollarSign
                    size={32}
                    className="text-slate-300 dark:text-slate-700"
                  />
                </div>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Console Standby
                </h3>
                <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold max-w-[200px]">
                  Select staff to modify finances.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
