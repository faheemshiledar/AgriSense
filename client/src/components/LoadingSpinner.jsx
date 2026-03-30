import React from "react";
import { Sprout } from "lucide-react";

export default function LoadingSpinner({ fullPage = false, message = "Loading..." }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-slate-700 border-t-emerald-500 animate-spin" />
        <Sprout size={16} className="text-emerald-400 absolute inset-0 m-auto" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950">
        {spinner}
      </div>
    );
  }
  return spinner;
}
