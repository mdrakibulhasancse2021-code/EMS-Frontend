/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Users,
  UserPlus,
  Search,
  Trash2,
  Edit3,
  ShieldCheck,
  X,
  Loader2,
  CheckSquare,
  Square,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/auth";

export default function StaffManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterRole, setFilterRole] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "Employee",
    department: "",
    designation: "",
    baseSalary: "",
  });

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
      const { data } = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to sync records");
    } finally {
      setLoading(false);
    }
  };

  // --- কাস্টম টোস্ট ডিলিট কনফার্মেশন ---
  const confirmDelete = (id: string, isBulk = false) => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <AlertTriangle size={18} /> Confirm Action
          </div>
          <p className="text-[11px] text-slate-300">
            {isBulk
              ? `Are you sure you want to delete ${selectedIds.length} staff members?`
              : "This action cannot be undone."}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-slate-700 text-white text-[10px] font-bold rounded-lg uppercase"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                isBulk ? handleBulkDelete() : handleDelete(id);
                closeToast();
              }}
              className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg uppercase"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Identity purged successfully");
      fetchEmployees(token);
    } catch (error) {
      toast.error("Purge denied");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post(
        `${API_URL}/bulk-delete`,
        { ids: selectedIds },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`${selectedIds.length} records cleared`);
      setSelectedIds([]);
      fetchEmployees(token);
    } catch (error) {
      toast.error("Bulk action failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const payload = {
      ...formData,
      baseSalary: formData.baseSalary === "" ? 0 : Number(formData.baseSalary),
    };

    try {
      if (isEditMode && selectedEmpId) {
        await axios.put(
          `${API_URL}/update-user/${selectedEmpId}`,
          payload,
          config
        );
        toast.success("Identity updated");
      } else {
        await axios.post(`${API_URL}/create-user`, payload, config);
        toast.success("Personnel onboarded");
      }
      closeModal();
      fetchEmployees(token);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Sync failed");
    }
  };

  const openEditModal = (emp: any) => {
    setIsEditMode(true);
    setSelectedEmpId(emp._id);
    setFormData({
      name: emp.name || "",
      phone: emp.phone || "",
      password: "",
      role: emp.role || "Employee",
      department: emp.department || "",
      designation: emp.designation || "",
      baseSalary: emp.baseSalary ? emp.baseSalary.toString() : "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setFormData({
      name: "",
      phone: "",
      password: "",
      role: "Employee",
      department: "",
      designation: "",
      baseSalary: "",
    });
  };

  const filteredEmployees = employees
    .filter((emp) => {
      const matchesSearch =
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone?.includes(searchTerm);
      const matchesRole = filterRole === "All" || emp.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const salaryA = Number(a.baseSalary || 0);
      const salaryB = Number(b.baseSalary || 0);
      return sortOrder === "asc" ? salaryA - salaryB : salaryB - salaryA;
    });

  return (
    <div className="space-y-4 pb-10">
      <ToastContainer theme="dark" position="top-center" autoClose={2500} />

      {/* Header - Ultra Professional */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-10 bg-blue-600 rounded-full" />
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              Registry
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-2">
              <UserCheck size={12} className="text-blue-500" /> Count:{" "}
              {employees.length}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={() => confirmDelete("", true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-red-500/20 shadow-lg transition-all active:scale-95"
            >
              <Trash2 size={14} /> Purge Selected ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <UserPlus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* Control Panel - Professional Filters */}
      <div className="bg-white dark:bg-[#020617] p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Scan records..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full lg:w-auto gap-2">
          <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
            {["All", "HR", "Employee", "Manager"].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${
                  filterRole === r
                    ? "bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-[9px] font-black uppercase text-slate-500 flex items-center gap-2 transition-all"
          >
            Sort: Salary{" "}
            {sortOrder === "asc" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Table Interface */}
      <div className="bg-white dark:bg-[#020617] border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="p-5 w-10">
                  <button
                    onClick={() =>
                      setSelectedIds(
                        selectedIds.length === filteredEmployees.length
                          ? []
                          : filteredEmployees.map((e) => e._id)
                      )
                    }
                  >
                    {selectedIds.length > 0 ? (
                      <CheckSquare size={16} className="text-blue-600" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest">
                  Personnel Details
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest">
                  Department
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest">
                  Base Salary
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-right">
                  Settings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-blue-500"
                      size={32}
                    />
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className={`hover:bg-slate-50/50 dark:hover:bg-blue-600/5 transition-all group ${
                      selectedIds.includes(emp._id)
                        ? "bg-blue-50/40 dark:bg-blue-900/10"
                        : ""
                    }`}
                  >
                    <td className="p-5">
                      <button
                        onClick={() =>
                          setSelectedIds((prev) =>
                            prev.includes(emp._id)
                              ? prev.filter((i) => i !== emp._id)
                              : [...prev, emp._id]
                          )
                        }
                      >
                        {selectedIds.includes(emp._id) ? (
                          <CheckSquare size={16} className="text-blue-600" />
                        ) : (
                          <Square
                            size={16}
                            className="text-slate-300 dark:text-slate-800"
                          />
                        )}
                      </button>
                    </td>
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl flex items-center justify-center font-black text-blue-600 text-[12px] shadow-sm">
                        {emp.name?.charAt(0)}
                      </div>
                      <div className="leading-tight">
                        <p className="text-[13px] font-bold text-slate-900 dark:text-slate-200 tracking-tight">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {emp.phone}
                        </p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ShieldCheck size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300 tracking-tighter">
                          {emp.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
                        <Briefcase size={10} /> {emp.department || "General"}
                      </p>
                    </td>
                    <td className="p-5 font-black text-[12px] text-blue-600 dark:text-blue-400 uppercase">
                      ৳
                      {emp.baseSalary
                        ? Number(emp.baseSalary).toLocaleString()
                        : "0"}
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => confirmDelete(emp._id)}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slim Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#020617] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                  {isEditMode ? "Modify Unit" : "New Account"}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Identity Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••"
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!isEditMode}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Access Role
                    </label>
                    <select
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Unit/Dept
                    </label>
                    <input
                      type="text"
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Base Monthly Salary (BDT)
                  </label>
                  <input
                    type="number"
                    placeholder="45,000"
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/10 shadow-inner"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, baseSalary: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-600/20 active:scale-95 transition-all"
                >
                  {isEditMode ? "Confirm Data Update" : "Establish New Access"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
