import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout, CloudSun, FlaskConical, Microscope,
  BrainCircuit, Network, ArrowRight, CheckCircle, Star
} from "lucide-react";

const FEATURES = [
  {
    icon: <Sprout    size={22} className="text-emerald-400" />,
    title: "Soil Analysis",
    desc:  "Transfer learning model analyzes your soil image to detect type, nutrients (NPK), pH, and moisture levels.",
    tag:   "MobileNet",
  },
  {
    icon: <CloudSun  size={22} className="text-sky-400" />,
    title: "Weather Intelligence",
    desc:  "Real-time weather data and 5-day forecasts to align crop choices with your local climate conditions.",
    tag:   "OpenWeather API",
  },
  {
    icon: <FlaskConical size={22} className="text-amber-400" />,
    title: "Smart Recommendations",
    desc:  "AI-powered crop selection, irrigation schedules, and fertilizer plans tailored to your exact soil & weather.",
    tag:   "Groq LLaMA",
  },
  {
    icon: <Microscope   size={22} className="text-red-400" />,
    title: "Disease Detection",
    desc:  "Upload a leaf photo and instantly detect plant diseases with confidence scores and treatment plans.",
    tag:   "ResNet-50",
  },
  {
    icon: <BrainCircuit size={22} className="text-purple-400" />,
    title: "Explainable AI",
    desc:  "Understand exactly why each recommendation was made — transparent, farmer-friendly explanations.",
    tag:   "XAI",
  },
  {
    icon: <Network      size={22} className="text-pink-400" />,
    title: "Federated Learning",
    desc:  "Privacy-preserving collaborative model training across multiple farms without sharing raw data.",
    tag:   "FedAvg",
  },
];

const STEPS = [
  { num: "01", title: "Upload & Locate", desc: "Upload your soil photo, leaf image, and enter your farm location." },
  { num: "02", title: "AI Analyzes",     desc: "Our multi-model AI pipeline processes soil, weather, and image data simultaneously." },
  { num: "03", title: "Get Insights",    desc: "Receive detailed crop recommendations, disease diagnoses, and actionable plans." },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                          bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px]
                          bg-blue-500/5 rounded-full blur-2xl" />
        </div>

        <div className="relative text-center max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 badge-green text-xs mb-6 px-4 py-2">
            <Star size={12} className="fill-emerald-400" />
            AI-Powered Agriculture Intelligence Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Farm Smarter
            <span className="block text-transparent bg-clip-text bg-gradient-to-r
                             from-emerald-400 to-teal-300">
              with AI
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your soil and leaf images. Get instant crop recommendations,
            disease diagnoses, irrigation plans, and fertilizer schedules — no IoT sensors needed.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?signup=true" className="btn-primary flex items-center gap-2 justify-center text-base px-8 py-4">
              Start Analyzing Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/auth" className="btn-secondary flex items-center gap-2 justify-center text-base px-8 py-4">
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
            {["No IoT Required", "Free to Use", "Instant Results", "Farmer Friendly"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-emerald-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need to Farm Better</h2>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto">
            A complete AI toolkit for modern farmers — from soil health to harvest planning.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title}
                 className="glass-green p-6 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-slate-800/80 flex items-center justify-center mb-4
                              group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white">{f.title}</h3>
                <span className="badge-slate text-xs">{f.tag}</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
            <p className="text-slate-400 mt-3">Three simple steps to intelligent farming decisions.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative text-center p-6 glass rounded-2xl">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 w-6 text-slate-600">
                    <ArrowRight size={20} />
                  </div>
                )}
                <div className="text-4xl font-black text-emerald-500/30 mb-3">{s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sprout size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Grow Smarter?</h2>
          <p className="text-slate-400 mt-4 mb-8 text-lg">
            Join farmers using AI to make better decisions every season.
          </p>
          <Link to="/auth?signup=true" className="btn-primary text-base px-10 py-4 inline-flex items-center gap-2">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-6 text-center text-slate-600 text-xs">
        <p>AgriSense AI · Built with Groq, Supabase & ❤️ for farmers everywhere</p>
      </footer>
    </div>
  );
}
