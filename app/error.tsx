"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("System Failure:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle size={32} />
      </div>
      <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter mb-2">
        Protocol Execution Failure
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        An unexpected error occurred during node synchronization. master
        registry has been informed.
      </p>
      <button
        onClick={() => reset()}
        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all"
      >
        <RefreshCw size={14} /> Re-sync Session
      </button>
    </div>
  );
}
