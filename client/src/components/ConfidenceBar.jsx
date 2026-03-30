import React, { useEffect, useRef } from "react";

export default function ConfidenceBar({ label, value, max = 100, color = "emerald", showPercent = true }) {
  const barRef = useRef(null);
  const pct = Math.round((value / max) * 100);

  const colorMap = {
    emerald: "bg-emerald-500",
    amber:   "bg-amber-500",
    red:     "bg-red-500",
    blue:    "bg-blue-500",
    purple:  "bg-purple-500",
  };

  const trackMap = {
    emerald: "bg-emerald-500/20",
    amber:   "bg-amber-500/20",
    red:     "bg-red-500/20",
    blue:    "bg-blue-500/20",
    purple:  "bg-purple-500/20",
  };

  useEffect(() => {
    if (!barRef.current) return;
    barRef.current.style.setProperty("--target-width", `${pct}%`);
    barRef.current.classList.add("animate-bar");
  }, [pct]);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="text-slate-300 font-medium">{label}</span>
        {showPercent && (
          <span className="text-slate-400 font-mono text-xs tabular-nums">
            {typeof value === "number" && max === 100 ? `${pct}%` : `${value}/${max}`}
          </span>
        )}
      </div>
      <div className={`h-2.5 rounded-full overflow-hidden ${trackMap[color] || trackMap.emerald}`}>
        <div
          ref={barRef}
          className={`h-full rounded-full ${colorMap[color] || colorMap.emerald}`}
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}
