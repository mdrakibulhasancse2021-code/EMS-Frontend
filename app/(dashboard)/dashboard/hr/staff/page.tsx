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
  Fingerprint,
  Cpu,
  ShieldAlert,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/auth";

export default function HRStaffManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
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
      setCurrentUser(user);
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
      toast.error("Records Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = (id: string, targetRole: string, isBulk = false) => {
    // লজিক: HR কখনো Admin ডিলিট করতে পারবে না
    if (currentUser?.role === "HR" && targetRole === "Admin") {
      toast.error("Protocol Violation: Admin accounts are shielded");
      return;
    }

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-widest">
            <AlertTriangle size={16} /> Protocol Confirmation
          </div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">
            {isBulk
              ? `Purge ${selectedIds.length} personnel logs?`
              : "Confirm removal from system registry?"}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-slate-800 text-white text-[9px] font-black rounded-lg uppercase"
            >
              Abort
            </button>
            <button
              onClick={() => {
                isBulk ? handleBulkDelete() : handleDelete(id);
                closeToast();
              }}
              className="px-3 py-1.5 bg-red-600 text-white text-[9px] font-black rounded-lg uppercase tracking-widest"
            >
              Execute
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false }
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Personnel identity purged");
      fetchEmployees(token);
    } catch (error) {
      toast.error("Authorization Denied");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await axios.post(
        `${API_URL}/bulk-delete`,
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bulk purge completed");
      setSelectedIds([]);
      fetchEmployees(token);
    } catch (error) {
      toast.error("Admin Access Required for Bulk Purge");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser?.role === "HR" && formData.role === "Admin") {
      toast.error("Access Denied: HR cannot establish Admin units");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const payload = {
      ...formData,
      baseSalary: Number(formData.baseSalary) || 0,
    };

    try {
      if (isEditMode && selectedEmpId) {
        await axios.put(
          `${API_URL}/update-user/${selectedEmpId}`,
          payload,
          config
        );
        toast.success("Registry log re-verified");
      } else {
        await axios.post(`${API_URL}/create-user`, payload, config);
        toast.success("Personnel identity established");
      }
      closeModal();
      fetchEmployees(token);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Protocol Failure");
    }
  };

  const openEditModal = (emp: any) => {
    if (currentUser?.role === "HR" && emp.role === "Admin") {
      toast.warning("Secure Unit: Admin files are read-only for HR");
      return;
    }
    setIsEditMode(true);
    setSelectedEmpId(emp._id);
    setFormData({
      name: emp.name || "",
      phone: emp.phone || "",
      password: "",
      role: emp.role || "Employee",
      department: emp.department || "",
      designation: emp.designation || "",
      baseSalary: emp.baseSalary?.toString() || "",
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
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.baseSalary - b.baseSalary
        : b.baseSalary - a.baseSalary
    );

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6 transition-all duration-300">
      {/* Toast Fixed Container */}
      <ToastContainer
        theme="dark"
        position="top-center"
        autoClose={2000}
        style={{ marginTop: "75px", zIndex: 9999 }} // Navbar এর নিচে নামানোর জন্য
      />

      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border-[1px] border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center text-blue-600 border-[1px] border-blue-600/20">
            <Cpu size={24} />
          </div>
          <div>
            <h1 className="text-[15px] font-black dark:text-white uppercase tracking-wider leading-none">
              System Staff Registry
            </h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-2">
              <Fingerprint size={12} className="text-blue-500" /> Authorized
              Terminal • Records: {employees.length}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {selectedIds.length > 0 && currentUser?.role === "Admin" && (
            <button
              onClick={() => confirmAction("", "Employee", true)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-xl border border-rose-500/20 shadow-lg active:scale-95 transition-all"
            >
              <Trash2 size={14} /> Purge ({selectedIds.length})
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <UserPlus size={16} /> New Entry
          </button>
        </div>
      </div>

      {/* --- Search & Filter --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Identify personnel by name or terminal ID..."
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-bold outline-none text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/10 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4 flex gap-2">
          <select
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest dark:text-slate-300 outline-none cursor-pointer"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Units</option>
            <option value="Employee">Employee</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 flex items-center gap-2 shadow-sm"
          >
            Salary{" "}
            {sortOrder === "asc" ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            )}
          </button>
        </div>
      </div>

      {/* --- Registry Table --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase">
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
                  Access/Rank
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest">
                  Remuneration
                </th>
                <th className="p-5 text-[9px] font-black tracking-widest text-right">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
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
                            className="text-slate-300 dark:text-slate-700"
                          />
                        )}
                      </button>
                    </td>
                    <td className="p-5 flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-xl flex items-center justify-center font-black text-blue-600 text-[12px] shadow-sm uppercase">
                        {emp.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-900 dark:text-slate-200 tracking-tight">
                          {emp.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                          {emp.phone}
                        </p>
                      </div>
                    </td>
                    <td className="p-5">
                      <div
                        className={`flex items-center gap-1.5 mb-1 ${
                          emp.role === "Admin"
                            ? "text-rose-500"
                            : "text-blue-500"
                        }`}
                      >
                        {emp.role === "Admin" ? (
                          <ShieldAlert size={12} />
                        ) : (
                          <ShieldCheck size={12} />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-tight">
                          {emp.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Briefcase size={10} />{" "}
                        {emp.department || "General Ops"}
                      </p>
                    </td>
                    <td className="p-5 font-black text-[12px] text-slate-900 dark:text-white tracking-widest">
                      ৳{emp.baseSalary?.toLocaleString() || "0"}
                    </td>
                    <td className="p-5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(emp)}
                        className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => confirmAction(emp._id, emp.role)}
                        className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
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

      {/* --- Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                  {isEditMode ? "Modify Log" : "Establish Identity"}
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
                    required
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Terminal Contact
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Secure Pass
                    </label>
                    <input
                      type="password"
                      required={!isEditMode}
                      placeholder="••••"
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Assign Rank
                    </label>
                    <select
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="Employee">Employee</option>
                      <option value="Manager">Manager</option>
                      <option value="HR">HR</option>
                      {currentUser?.role === "Admin" && (
                        <option value="Admin">Admin</option>
                      )}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                      Department
                    </label>
                    <input
                      type="text"
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                    Monthly BDT (Salary)
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[11px] font-bold dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                    value={formData.baseSalary}
                    onChange={(e) =>
                      setFormData({ ...formData, baseSalary: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="w-full mt-4 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-blue-700 shadow-2xl shadow-blue-600/30 active:scale-95 transition-all"
                >
                  {isEditMode ? "Modify System Record" : "Establish New Unit"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
