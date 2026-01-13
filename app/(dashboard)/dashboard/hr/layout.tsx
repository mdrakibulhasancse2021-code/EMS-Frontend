/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";

/**
 * @desc    HR Dashboard Layout
 * @route   /dashboard/hr
 */
export default function HRLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <main className="w-full">{children}</main>
    </div>
  );
}
