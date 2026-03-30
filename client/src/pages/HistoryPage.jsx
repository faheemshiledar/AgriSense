import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import {
  History, MapPin, Sprout, FlaskConical, Microscope,
  ChevronDown, ChevronUp, Trash2, Calendar, AlertCircle, Inbox
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function HistoryPage() {
  const { user }        = useAuth();
  const [analyses,  setAnalyses]  = useState([]);
  const [scans,     setScans]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [expanded,  setExpanded]  = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [aRes, sRes] = await Promise.all([
        supabase.from("analyses").select("*").order("created_at", { ascending: false }).limit(20),
        supabase.from("disease_scans").select("*").order("created_at", { ascending: false }).limit(20),
      ]);
      setAnalyses(aRes.data || []);
      setScans(sRes.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const deleteAnalysis = async (id) => {
    setDeleting(id);
    await supabase.from("analyses").delete().eq("id", id);
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  };

  const deleteScan = async (id) => {
    setDeleting(id);
    await supabase.from("disease_scans").delete().eq("id", id);
    setScans((prev) => prev.filter((s) => s.id !== id));
    setDeleting(null);
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit"
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner message="Loading your history…" />
    </div>
  );

  const isEmpty = analyses.length === 0 && scans.length === 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <History size={28} className="text-emerald-400" />
          Analysis History
        </h1>
        <p className="text-slate-400 mt-1">Your saved soil analyses and disease scans.</p>
      </div>

      {isEmpty && (
        <div className="glass rounded-2xl p-12 text-center">
          <Inbox size={40} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No saved analyses yet</h3>
          <p className="text-slate-500 text-sm mb-6">
            Run an analysis and click "Save Results" to store it here.
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <Sprout size={16} />Start Analysis
          </Link>
        </div>
      )}

      {/* ── Soil Analyses ─────────────────────────────────────────────────────── */}
      {analyses.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FlaskConical size={14} className="text-amber-400" />
            Soil Analyses ({analyses.length})
          </h2>
          <div className="space-y-3">
            {analyses.map((a) => (
              <div key={a.id} className="glass-green overflow-hidden">
                {/* Header row */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FlaskConical size={18} className="text-amber-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{a.soil_type || "Unknown Soil"}</span>
                        {a.crops?.[0]?.name && (
                          <span className="badge-green text-xs">{a.crops[0].name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                        {a.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />{a.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />{fmt(a.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteAnalysis(a.id); }}
                      disabled={deleting === a.id}
                      className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expanded === a.id
                      ? <ChevronUp size={16} className="text-slate-400" />
                      : <ChevronDown size={16} className="text-slate-400" />
                    }
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === a.id && (
                  <div className="px-4 pb-4 border-t border-slate-700/50 pt-4 space-y-4 animate-fade-in">
                    {/* NPK */}
                    {a.npk && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">NPK Values</p>
                        <div className="grid grid-cols-3 gap-3">
                          {[["N", "emerald"], ["P", "blue"], ["K", "amber"]].map(([k, c]) => (
                            <div key={k} className={`bg-${c}-500/10 border border-${c}-500/20 rounded-xl p-3 text-center`}>
                              <p className={`text-xs text-${c}-400`}>{k === "N" ? "Nitrogen" : k === "P" ? "Phosphorus" : "Potassium"}</p>
                              <p className="text-xl font-bold text-white">{a.npk[k]}</p>
                              <p className="text-xs text-slate-500">kg/ha</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Top crops */}
                    {a.crops && a.crops.length > 0 && (
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recommended Crops</p>
                        <div className="flex flex-wrap gap-2">
                          {a.crops.map((c, i) => (
                            <div key={i} className={`badge ${i === 0 ? "badge-green" : "badge-slate"}`}>
                              {i === 0 && "⭐ "}{c.name}
                              <span className="text-slate-500 ml-1">{c.suitability}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Irrigation method */}
                    {a.irrigation?.method && (
                      <div className="text-sm text-slate-300">
                        <span className="text-slate-500">Irrigation: </span>
                        {a.irrigation.method} · {a.irrigation.frequency}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Disease Scans ─────────────────────────────────────────────────────── */}
      {scans.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Microscope size={14} className="text-red-400" />
            Disease Scans ({scans.length})
          </h2>
          <div className="space-y-3">
            {scans.map((s) => (
              <div key={s.id} className="glass-green p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${s.disease_name === "Healthy" ? "bg-emerald-500/15" : "bg-red-500/15"}`}>
                    <Microscope size={18} className={s.disease_name === "Healthy" ? "text-emerald-400" : "text-red-400"} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-white">{s.disease_name}</span>
                      {s.severity && s.severity !== "None" && (
                        <span className={`badge text-xs ${
                          s.severity === "High" || s.severity === "Critical" ? "badge-red"
                            : s.severity === "Moderate" ? "badge-amber" : "badge-green"}`}>
                          {s.severity}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      {s.confidence && (
                        <span>{Math.round(s.confidence * 100)}% confidence</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />{fmt(s.created_at)}
                      </span>
                    </div>
                    {s.explanation && (
                      <p className="text-xs text-slate-400 mt-1 truncate max-w-sm">{s.explanation}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deleteScan(s.id)}
                  disabled={deleting === s.id}
                  className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
