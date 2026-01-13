/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Calculator,
  Search,
  RefreshCw,
  Loader2,
  Plus,
  Minus,
  CheckCircle,
  History,
  ChevronRight,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api";

export default function AdminPayroll() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedPayroll, setProcessedPayroll] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [monthsList, setMonthsList] = useState<string[]>([]);

  // ১. সিলেক্টেড এমপ্লয়ি আইডি রাখার জন্য নতুন স্টেট
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const months = [];
    const d = new Date();
    for (let i = 0; i < 6; i++) {
      const tempDate = new Date(d.getFullYear(), d.getMonth() - i, 1);
      months.push(
        tempDate.toLocaleString("default", { month: "long" }) +
          "-" +
          tempDate.getFullYear()
      );
    }
    setMonthsList(months);
    setSelectedMonth(months[0]);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.token) {
      setToken(user.token);
      fetchEmployees(user.token);
    }
  }, []);

  const fetchEmployees = async (authToken: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/auth/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(data);
    } catch (error) {
      toast.error("Staff fetch failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrGeneratePayroll = async (employeeId: string) => {
    // ২. বাটনে ক্লিক করলে আইডি সেভ করা
    setSelectedEmployeeId(employeeId);
    setIsProcessing(true);
    setProcessedPayroll(null);
    try {
      const { data } = await axios.post(
        `${API_URL}/payroll/generate`,
        { employeeId, month: selectedMonth },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProcessedPayroll(data.payroll);
    } catch (error: any) {
      toast.error("Sync failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!processedPayroll) return;
    try {
      await axios.put(
        `${API_URL}/payroll/pay/${processedPayroll._id}`,
        { status: "Paid" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProcessedPayroll({ ...processedPayroll, status: "Paid" });
      toast.success("Paid!");
    } catch (error) {
      toast.error("Error");
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phone?.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 space-y-4 min-h-screen bg-slate-50 dark:bg-[#020617]">
      <ToastContainer theme="dark" autoClose={1500} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-blue-600 rounded-full" />
          <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Payroll
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase p-2 rounded-lg border border-slate-200 dark:border-slate-700 outline-none dark:text-slate-300"
          >
            {monthsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={() => fetchEmployees(token)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[500px]">
          <div className="p-3 border-b border-slate-50 dark:border-slate-800">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={14}
              />
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] font-bold outline-none dark:text-slate-200 border border-transparent focus:border-blue-500/20"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
            {loading ? (
              <div className="p-10 text-center">
                <Loader2 className="animate-spin inline text-blue-500" />
              </div>
            ) : (
              filteredEmployees.map((emp) => (
                <button
                  key={emp._id}
                  onClick={() => fetchOrGeneratePayroll(emp._id)}
                  // ৩. সিলেকশন লজিক অনুযায়ী ডাইনামিক ক্লাস যোগ করা
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all border-2 ${
                    selectedEmployeeId === emp._id
                      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500/50"
                      : "border-transparent hover:bg-slate-50 dark:hover:bg-blue-900/10 group"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                        selectedEmployeeId === emp._id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-blue-500"
                      }`}
                    >
                      {emp.name?.charAt(0)}
                    </div>
                    <div className="text-left">
                      <p
                        className={`text-[11px] font-bold ${
                          selectedEmployeeId === emp._id
                            ? "text-blue-600 dark:text-blue-400"
                            : "dark:text-slate-200"
                        }`}
                      >
                        {emp.name}
                      </p>
                      <p className="text-[9px] text-slate-400 uppercase">
                        {emp.role}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={12}
                    className={`${
                      selectedEmployeeId === emp._id
                        ? "text-blue-500"
                        : "text-slate-300 group-hover:text-blue-500"
                    }`}
                  />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <div className="h-full min-h-[400px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center p-10">
                <Loader2 className="animate-spin text-blue-500 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Processing...
                </p>
              </div>
            ) : processedPayroll ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div
                  className={`p-2 text-center text-[9px] font-black uppercase tracking-[0.2em] ${
                    processedPayroll.status === "Paid"
                      ? "bg-emerald-500"
                      : "bg-amber-500"
                  } text-white`}
                >
                  Status: {processedPayroll.status}
                </div>
                <div className="p-6 space-y-6">
                  {/* ... বাকি কোড অপরিবর্তিত ... */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase">
                        Statement
                      </p>
                      <h2 className="text-lg font-black dark:text-white uppercase">
                        {selectedMonth}
                      </h2>
                    </div>
                    <CreditCard size={20} className="text-slate-300" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-emerald-500 uppercase mb-2 flex items-center gap-1">
                        <Plus size={10} /> Credits
                      </p>
                      <div className="space-y-1 text-[10px] font-bold">
                        <div className="flex justify-between text-slate-500">
                          Base:{" "}
                          <span className="dark:text-white">
                            ৳{processedPayroll.basicSalary?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          Bonus:{" "}
                          <span className="text-emerald-500">
                            + ৳{processedPayroll.totalBonus?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-rose-500 uppercase mb-2 flex items-center gap-1">
                        <Minus size={10} /> Debits
                      </p>
                      <div className="space-y-1 text-[10px] font-bold">
                        <div className="flex justify-between text-slate-500">
                          Attendance:{" "}
                          <span className="text-rose-500">
                            - ৳
                            {processedPayroll.deductions?.attendance?.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          Tasks:{" "}
                          <span className="text-rose-500">
                            - ৳
                            {processedPayroll.deductions?.tasks?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-[9px] font-black text-blue-500 uppercase">
                        Net Payable
                      </p>
                      <p className="text-3xl font-black dark:text-white tracking-tighter">
                        ৳{processedPayroll.netPayable?.toLocaleString()}
                      </p>
                    </div>
                    {processedPayroll.status === "Unpaid" ? (
                      <button
                        onClick={handleProcessPayment}
                        className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 active:scale-95 transition-all shadow-md"
                      >
                        Mark as Paid
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-500 font-black uppercase text-[9px] bg-emerald-500/10 px-4 py-2 rounded-lg border border-emerald-500/20">
                        <CheckCircle size={14} /> Settlement Closed
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800 p-10 text-center">
                <Calculator size={32} className="text-slate-200 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Select Staff to View Slip
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
