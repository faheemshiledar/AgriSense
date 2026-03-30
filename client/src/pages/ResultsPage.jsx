import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import ConfidenceBar from "../components/ConfidenceBar";
import WeatherWidget from "../components/WeatherWidget";
import FederatedDemo from "../components/FederatedDemo";
import {
  Sprout, Microscope, Droplets, FlaskConical, BrainCircuit,
  ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info,
  Leaf, Calendar, TrendingUp, Save, ArrowLeft, Star, Zap, Network
} from "lucide-react";

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, badge }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 bg-slate-800/80 rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {badge && <span className="badge-slate text-xs">{badge}</span>}
      </div>
    </div>
  );
}

function NPKBar({ label, value, max = 100, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span><span className="font-mono">{value} kg/ha</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-1000`}
          style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
        />
      </div>
    </div>
  );
}

function XAIAccordion({ factors, summary }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-green">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <BrainCircuit size={18} className="text-purple-400" />
          <span className="font-semibold text-white">Why these recommendations?</span>
          <span className="badge-slate text-xs hidden sm:inline">Explainable AI</span>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-700/50 pt-4 space-y-4 animate-fade-in">
          {summary && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-200 text-sm leading-relaxed">{summary}</p>
            </div>
          )}
          {factors && factors.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Key Influencing Factors</p>
              {factors.map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0
                    ${f.impact === "positive" ? "bg-emerald-400" : f.impact === "negative" ? "bg-red-400" : "bg-slate-400"}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{f.factor}</span>
                      <span className="text-xs text-slate-500">{f.value}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        f.impact === "positive" ? "text-emerald-400 bg-emerald-500/10"
                          : f.impact === "negative" ? "text-red-400 bg-red-500/10"
                          : "text-slate-400 bg-slate-700/50"}`}>
                        {f.impact}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{f.reason || f.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  const { soilData, weatherData, diseaseData, recommendations, location: farmLocation } =
    location.state || {};

  useEffect(() => {
    if (!soilData || !weatherData) navigate("/dashboard");
  }, []);

  if (!soilData || !weatherData) return null;

  const { analysis: soilAnalysis, npk, soilType, confidence, ph, moisture } = soilData;
  const rec = recommendations || {};

  // Save to Supabase history
  const handleSave = async () => {
    if (!user || saving || saved) return;
    setSaving(true);
    try {
      await supabase.from("analyses").insert({
        user_id:    user.id,
        location:   farmLocation,
        soil_type:  soilType,
        npk,
        weather:    weatherData,
        crops:      rec.top_crops,
        fertilizer: rec.fertilizer,
        irrigation: rec.irrigation,
        xai:        rec.key_factors,
      });

      if (diseaseData) {
        await supabase.from("disease_scans").insert({
          user_id:     user.id,
          disease_name: diseaseData.disease,
          confidence:   diseaseData.confidence,
          severity:     diseaseData.severity,
          treatment:    diseaseData.analysis?.treatment,
          explanation:  diseaseData.analysis?.farmer_explanation,
        });
      }
      setSaved(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const severityColor = (s) =>
    ({ None: "badge-green", Low: "badge-green", Moderate: "badge-amber", High: "badge-red", Critical: "badge-red" }[s] || "badge-slate");

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <Link to="/dashboard" className="hover:text-slate-300 flex items-center gap-1">
              <ArrowLeft size={14} />Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-300">Analysis Results</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Analysis Results <span className="text-slate-500 text-base font-normal">— {farmLocation}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/history" className="btn-secondary text-sm px-4 py-2">View History</Link>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${saved ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "btn-primary"}`}
          >
            {saved ? <><CheckCircle size={14} />Saved!</>
                   : saving ? <>Saving…</> : <><Save size={14} />Save Results</>}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Soil Analysis ─────────────────────────────────────────────────── */}
        <div className="glass-green p-6">
          <SectionHeader
            icon={<FlaskConical size={20} className="text-amber-400" />}
            title="Soil Analysis"
            badge={`MobileNet · ${Math.round((confidence || 0.85) * 100)}% confidence`}
          />
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-white">{soilType}</div>
                <div className="space-y-1">
                  <span className={`badge ${soilAnalysis?.quality === "Excellent" || soilAnalysis?.quality === "Good" ? "badge-green" : "badge-amber"}`}>
                    {soilAnalysis?.quality || "Good"} Quality
                  </span>
                  <p className="text-xs text-slate-500">pH {ph} · {moisture}% moisture</p>
                </div>
              </div>
              {soilAnalysis?.summary && (
                <p className="text-slate-300 text-sm leading-relaxed">{soilAnalysis.summary}</p>
              )}
              {soilAnalysis?.farmer_explanation && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Info size={11} />Plain English</p>
                  <p className="text-emerald-200 text-sm">{soilAnalysis.farmer_explanation}</p>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider">NPK Values</p>
              <NPKBar label="Nitrogen (N)"   value={npk?.N} max={100} color="bg-emerald-500" />
              <NPKBar label="Phosphorus (P)" value={npk?.P} max={100} color="bg-blue-500" />
              <NPKBar label="Potassium (K)"  value={npk?.K} max={100} color="bg-amber-500" />
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500">pH Level</p>
                  <p className="text-xl font-bold text-white mt-0.5">{ph}</p>
                </div>
                <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                  <p className="text-xs text-slate-500">Moisture</p>
                  <p className="text-xl font-bold text-white mt-0.5">{moisture}%</p>
                </div>
              </div>
            </div>
          </div>

          {soilAnalysis?.characteristics && (
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Key Characteristics</p>
              <div className="flex flex-wrap gap-2">
                {soilAnalysis.characteristics.map((c) => (
                  <span key={c} className="badge-slate text-xs">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Weather ────────────────────────────────────────────────────────── */}
        <WeatherWidget data={weatherData} />

        {/* ── Disease Detection ─────────────────────────────────────────────── */}
        {diseaseData && (
          <div className="glass-green p-6">
            <SectionHeader
              icon={<Microscope size={20} className="text-red-400" />}
              title="Disease Detection"
              badge={`ResNet-50 · ${Math.round((diseaseData.confidence || 0.85) * 100)}% confidence`}
            />
            {diseaseData.isHealthy ? (
              <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                <CheckCircle size={36} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-emerald-400">Plant is Healthy! 🎉</p>
                  <p className="text-slate-300 text-sm mt-1">{diseaseData.analysis?.farmer_explanation}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-xl font-bold text-white">{diseaseData.disease}</h3>
                      <span className={severityColor(diseaseData.severity)}>{diseaseData.severity} Severity</span>
                    </div>
                    <p className="text-slate-400 text-xs italic">{diseaseData.scientificName}</p>
                    <p className="text-xs text-slate-400 mt-1">Affects: {diseaseData.affectedCrop}</p>
                  </div>
                  <div className="w-48">
                    <ConfidenceBar
                      label="Detection Confidence"
                      value={Math.round((diseaseData.confidence || 0.85) * 100)}
                      color={diseaseData.confidence > 0.85 ? "red" : "amber"}
                    />
                  </div>
                </div>

                {diseaseData.analysis?.summary && (
                  <p className="text-slate-300 text-sm leading-relaxed">{diseaseData.analysis.summary}</p>
                )}

                {diseaseData.analysis?.farmer_explanation && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Info size={11} />Plain English</p>
                    <p className="text-amber-200 text-sm">{diseaseData.analysis.farmer_explanation}</p>
                  </div>
                )}

                {/* Treatment steps */}
                {diseaseData.analysis?.treatment && diseaseData.analysis.treatment.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Treatment Plan</p>
                    <div className="space-y-2">
                      {diseaseData.analysis.treatment.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-3">
                          <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center text-xs font-bold text-red-400 flex-shrink-0">
                            {t.step || i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{t.action || t}</p>
                            {t.detail && <p className="text-xs text-slate-400 mt-0.5">{t.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prevention */}
                {diseaseData.analysis?.prevention && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Prevention Tips</p>
                    <ul className="space-y-1.5">
                      {diseaseData.analysis.prevention.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <CheckCircle size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Crop Recommendations ───────────────────────────────────────────── */}
        {rec.top_crops && rec.top_crops.length > 0 && (
          <div className="glass-green p-6">
            <SectionHeader
              icon={<Sprout size={20} className="text-emerald-400" />}
              title="Crop Recommendations"
              badge="Groq AI · LLaMA 3.3"
            />
            <div className="grid sm:grid-cols-3 gap-4">
              {rec.top_crops.map((crop, i) => (
                <div key={i} className={`bg-slate-800/60 rounded-2xl p-5 border transition-all
                  ${i === 0 ? "border-emerald-500/40 ring-1 ring-emerald-500/20" : "border-slate-700/50"}`}>
                  {i === 0 && (
                    <div className="flex items-center gap-1 badge-green text-xs mb-3 w-fit">
                      <Star size={10} className="fill-emerald-400" /> Top Pick
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1">{crop.name}</h3>
                  <p className="text-xs text-slate-400 mb-3">{crop.season} · {crop.duration_days} days</p>

                  <ConfidenceBar label="Suitability" value={crop.suitability} color={i === 0 ? "emerald" : "blue"} />

                  <div className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Expected Yield</span>
                      <span className="text-white font-medium">{crop.expected_yield}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Water Needs</span>
                      <span className={`font-medium ${crop.water_requirement === "Low" ? "text-emerald-400" : crop.water_requirement === "High" ? "text-red-400" : "text-amber-400"}`}>
                        {crop.water_requirement}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Market Value</span>
                      <span className={`font-medium ${crop.market_value === "High" ? "text-emerald-400" : "text-slate-300"}`}>
                        {crop.market_value}
                      </span>
                    </div>
                  </div>

                  {crop.why_recommended && (
                    <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-700/50 leading-relaxed">
                      {crop.why_recommended}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {rec.overall_summary && (
              <div className="mt-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Info size={11} />AI Summary</p>
                <p className="text-emerald-200 text-sm leading-relaxed">{rec.overall_summary}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Irrigation & Fertilizer ────────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Irrigation */}
          {rec.irrigation && (
            <div className="glass-green p-6">
              <SectionHeader icon={<Droplets size={20} className="text-blue-400" />} title="Irrigation Plan" />
              <div className="space-y-3">
                {[
                  { label: "Method",      value: rec.irrigation.method },
                  { label: "Frequency",   value: rec.irrigation.frequency },
                  { label: "Amount",      value: `${rec.irrigation.amount_liters_per_sqm} L/m²` },
                  { label: "Best Time",   value: rec.irrigation.best_time },
                ].map((r) => r.value && (
                  <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-700/40">
                    <span className="text-slate-400 text-sm">{r.label}</span>
                    <span className="text-white text-sm font-medium">{r.value}</span>
                  </div>
                ))}

                {rec.irrigation.weekly_schedule && (
                  <div className="pt-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Weekly Schedule</p>
                    <div className="grid grid-cols-7 gap-1">
                      {Object.entries(rec.irrigation.weekly_schedule).map(([day, action]) => (
                        <div key={day} className={`text-center rounded-lg py-1.5 text-xs
                          ${action === "irrigate"
                            ? "bg-blue-500/20 text-blue-400 font-medium"
                            : action === "skip"
                              ? "bg-slate-800/50 text-slate-600"
                              : "bg-amber-500/15 text-amber-400"}`}>
                          <div className="text-slate-500 text-xs mb-0.5">{day.slice(0,3)}</div>
                          <div className="text-xs">{action === "irrigate" ? "💧" : action === "skip" ? "—" : "🔍"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fertilizer */}
          {rec.fertilizer && (
            <div className="glass-green p-6">
              <SectionHeader icon={<FlaskConical size={20} className="text-amber-400" />} title="Fertilizer Plan" />
              <div className="space-y-3">
                {rec.fertilizer.base_npk && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Recommended NPK Ratio</p>
                    <p className="text-2xl font-black text-amber-400 mt-1">{rec.fertilizer.base_npk}</p>
                  </div>
                )}

                {rec.fertilizer.schedule && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Application Schedule</p>
                    <div className="space-y-2">
                      {rec.fertilizer.schedule.map((s, i) => (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-sm font-medium text-white">{s.timing}</span>
                            <span className="badge-amber text-xs">{s.type}</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>{s.quantity_kg_per_ha} kg/ha</span>
                            <span>{s.note}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rec.fertilizer.organic_alternatives && rec.fertilizer.organic_alternatives.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">🌿 Organic Options</p>
                    {rec.fertilizer.organic_alternatives.map((o, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-emerald-300 py-1">
                        <CheckCircle size={12} className="text-emerald-400" />{o}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── XAI Explanation ────────────────────────────────────────────────── */}
        <XAIAccordion
          factors={rec.key_factors || soilAnalysis?.xai_factors}
          summary={rec.overall_summary}
        />

        {/* ── Federated Learning Demo ────────────────────────────────────────── */}
        <div className="glass-green p-1">
          <div className="px-5 pt-5 pb-2 flex items-center gap-2">
            <Network size={18} className="text-pink-400" />
            <h2 className="text-lg font-bold text-white">Federated Learning Simulation</h2>
          </div>
          <div className="px-5 pb-5">
            <FederatedDemo />
          </div>
        </div>

        {/* ── Warnings ─────────────────────────────────────────────────────── */}
        {rec.warnings && rec.warnings.filter(Boolean).length > 0 && (
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-400" />
              <h3 className="font-semibold text-white">Important Warnings</h3>
            </div>
            <ul className="space-y-2">
              {rec.warnings.filter(Boolean).map((w, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-200">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">⚠</span>{w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Action buttons ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 justify-center pt-2 pb-6">
          <Link to="/dashboard" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} />New Analysis
          </Link>
          <button onClick={handleSave} disabled={saving || saved} className="btn-primary flex items-center gap-2">
            {saved ? <><CheckCircle size={16} />Saved to History</> : <><Save size={16} />Save Results</>}
          </button>
        </div>
      </div>
    </div>
  );
}
