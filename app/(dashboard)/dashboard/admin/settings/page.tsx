/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Lock,
  Bell,
  Moon,
  ShieldCheck,
  Save,
  Loader2,
  Camera,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "https://ems-backend-sigma.vercel.app/api/auth";

export default function AdminSettings() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setProfileData({
        name: parsedUser.name || "",
        phone: parsedUser.phone || "",
      });
    }
  }, []);

  // ১. প্রোফাইল আপডেট ফাংশন
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${API_URL}/profile/update`,
        profileData,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ ...data, token: user.token })
      );
      setUser({ ...data, token: user.token });
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ২. পাসওয়ার্ড পরিবর্তন ফাংশন
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 6)
      return toast.warning("Password too short");

    setPassLoading(true);
    try {
      await axios.put(`${API_URL}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Current password incorrect"
      );
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 space-y-6 min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      <ToastContainer theme="dark" autoClose={1500} />

      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="w-1 h-6 bg-indigo-600 rounded-full" />
        <h1 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
          Account Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Info Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-center shadow-sm">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-full h-full bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute -bottom-1 -right-1 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600 border border-slate-100 dark:border-slate-700">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-lg font-black dark:text-white uppercase">
              {user?.name}
            </h2>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              {user?.role} Level
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
              Quick Toggles
            </h3>
            <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <Moon size={16} />{" "}
                <span className="text-xs font-bold">Night Mode</span>
              </div>
              <div className="w-8 h-4 bg-indigo-600 rounded-full relative">
                <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                <User size={18} />
              </div>
              <h3 className="text-sm font-black dark:text-white uppercase">
                Profile Identity
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Display Name
                  </label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold dark:text-white outline-none border border-transparent focus:border-indigo-500/30 shadow-inner"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Contact Phone
                  </label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold dark:text-white outline-none border border-transparent focus:border-indigo-500/30 shadow-inner"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}{" "}
                  Commit Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg text-rose-600">
                <KeyRound size={18} />
              </div>
              <h3 className="text-sm font-black dark:text-white uppercase">
                Security Protocol
              </h3>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showOldPass ? "text" : "password"}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold dark:text-white outline-none border border-transparent focus:border-rose-500/30 shadow-inner"
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showOldPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    New Secure Key
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showNewPass ? "text" : "password"}
                      className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-bold dark:text-white outline-none border border-transparent focus:border-rose-500/30 shadow-inner"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-6 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-all"
                >
                  {passLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}{" "}
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
