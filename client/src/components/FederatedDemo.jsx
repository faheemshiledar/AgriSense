import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import { Users, Server, Zap, RefreshCw } from "lucide-react";
import { getFederatedData } from "../services/apiService";

const COLORS = { farmer_a: "#10b981", farmer_b: "#f59e0b", farmer_c: "#60a5fa", global: "#a78bfa" };

export default function FederatedDemo() {
  const [data,         setData]         = useState(null);
  const [chartData,    setChartData]    = useState([]);
  const [animRound,    setAnimRound]    = useState(0);
  const [loading,      setLoading]      = useState(true);
  const [running,      setRunning]      = useState(false);

  useEffect(() => {
    getFederatedData()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Animate rounds one by one
  const startAnimation = () => {
    if (!data || running) return;
    setChartData([]);
    setAnimRound(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || !data) return;
    if (animRound >= data.rounds.length) { setRunning(false); return; }

    const t = setTimeout(() => {
      const r = data.rounds[animRound];
      setChartData((prev) => [
        ...prev,
        {
          round:    `Round ${r.round}`,
          "Farmer Arjun":  +(r.clients[0].localAccuracy * 100).toFixed(1),
          "Farmer Priya":  +(r.clients[1].localAccuracy * 100).toFixed(1),
          "Farmer Ravi":   +(r.clients[2].localAccuracy * 100).toFixed(1),
          "Global Model":  +(r.globalAccuracy * 100).toFixed(1),
        },
      ]);
      setAnimRound((p) => p + 1);
    }, 600);

    return () => clearTimeout(t);
  }, [running, animRound, data]);

  if (loading) return (
    <div className="glass-green p-6 flex items-center justify-center h-48">
      <div className="text-slate-400 text-sm animate-pulse">Loading federated data…</div>
    </div>
  );
  if (!data) return null;

  return (
    <div className="glass-green p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Federated Learning Demo</h3>
          <p className="text-slate-400 text-sm mt-0.5">
            {data.summary.algorithm} · {data.summary.totalClients} clients · {data.summary.totalSamples.toLocaleString()} samples
          </p>
        </div>
        <button
          onClick={startAnimation}
          disabled={running}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
            ${running ? "opacity-50 cursor-not-allowed bg-slate-800 text-slate-400"
                      : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"}`}
        >
          <RefreshCw size={14} className={running ? "animate-spin" : ""} />
          {running ? "Training…" : chartData.length ? "Re-run" : "Start Simulation"}
        </button>
      </div>

      {/* Formula */}
      <div className="bg-slate-800/60 rounded-xl px-4 py-3 flex items-center gap-3">
        <Zap size={16} className="text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-slate-500">FedAvg Aggregation Formula</p>
          <code className="text-xs text-amber-300 font-mono">{data.summary.formula}</code>
          <p className="text-xs text-slate-500 mt-0.5">where n_i = local samples, w_i = local weights</p>
        </div>
      </div>

      {/* Farmer cards */}
      <div className="grid grid-cols-3 gap-3">
        {data.farmers.map((f, i) => (
          <div key={f.id} className="bg-slate-800/50 rounded-xl p-3 text-center">
            <div className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center"
                 style={{ background: Object.values(COLORS)[i] + "25", border: `1px solid ${Object.values(COLORS)[i]}50` }}>
              <Users size={14} style={{ color: Object.values(COLORS)[i] }} />
            </div>
            <p className="text-xs font-semibold text-white">{f.name}</p>
            <p className="text-xs text-slate-500">{f.region}</p>
            <p className="text-xs text-slate-400 mt-1">{f.samples} samples</p>
            <span className="badge-slate text-xs mt-1">{f.cropType}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Model Accuracy per Round (%)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="round" tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis domain={[55, 100]} tick={{ fill: "#94a3b8", fontSize: 11 }} unit="%" />
              <Tooltip
                contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(v, n) => [`${v}%`, n]}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Line type="monotone" dataKey="Farmer Arjun" stroke={COLORS.farmer_a} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Farmer Priya" stroke={COLORS.farmer_b} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Farmer Ravi"  stroke={COLORS.farmer_c} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Global Model" stroke={COLORS.global}   strokeWidth={2.5}
                    strokeDasharray="5 3" dot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm gap-2">
          <Server size={28} className="text-slate-700" />
          <p>Click "Start Simulation" to run federated training</p>
        </div>
      )}

      {/* Final result */}
      {!running && chartData.length === 5 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Final Global Accuracy</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {(data.summary.finalAccuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400">Accuracy Gain</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">
              +{(data.summary.improvement * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
