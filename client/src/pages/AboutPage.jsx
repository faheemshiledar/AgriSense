import React from "react";
import {
  Sprout, CloudSun, FlaskConical, Microscope,
  BrainCircuit, Network, Mail, User, Code2, Layers, Github
} from "lucide-react";

const TECH_STACK = [
  { label: "Frontend",  value: "React 18, Vite, Tailwind CSS" },
  { label: "Backend",   value: "Vercel Serverless Functions (Node.js)" },
  { label: "Database",  value: "Supabase (PostgreSQL)" },
  { label: "Auth",      value: "Supabase Auth" },
  { label: "AI / LLM",  value: "Groq API — LLaMA 3.3 70B" },
  { label: "Weather",   value: "OpenWeather API" },
  { label: "Models",    value: "MobileNet (soil), ResNet-50 (disease)" },
  { label: "Privacy",   value: "Federated Learning — FedAvg" },
];

const FEATURES = [
  { icon: <Sprout     size={18} className="text-emerald-400" />, label: "Soil Analysis" },
  { icon: <CloudSun   size={18} className="text-sky-400"     />, label: "Weather Intelligence" },
  { icon: <FlaskConical size={18} className="text-amber-400" />, label: "Smart Recommendations" },
  { icon: <Microscope  size={18} className="text-red-400"    />, label: "Disease Detection" },
  { icon: <BrainCircuit size={18} className="text-purple-400"/>, label: "Explainable AI" },
  { icon: <Network     size={18} className="text-pink-400"   />, label: "Federated Learning" },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

      {/* ── Page Header ───────────────────────────────────────────────────── */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 badge-green text-xs mb-4 px-4 py-2">
          <Sprout size={12} className="text-emerald-400" />
          About AgriSense AI
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Built for Farmers,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
            Powered by AI
          </span>
        </h1>
        <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          AgriSense is an open, no-sensor AI platform that helps farmers make
          smarter decisions — from soil health to crop selection and disease
          detection — using only photos and location data.
        </p>
      </div>

      {/* ── What is AgriSense ─────────────────────────────────────────────── */}
      <section className="glass rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <Layers size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">What is AgriSense?</h2>
        </div>
        <p className="text-slate-400 leading-relaxed">
          AgriSense is a full-stack AI agriculture platform designed to bring
          precision farming to every farmer — without expensive IoT hardware.
          By combining computer vision models, real-time weather data, and
          large language models, AgriSense delivers actionable insights
          instantly from a simple image upload.
        </p>
        <p className="text-slate-400 leading-relaxed">
          The platform is built with privacy in mind. Federated learning allows
          collaborative model improvement across farms without any raw data
          ever leaving the farmer's device.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 pt-2">
          {FEATURES.map((f) => (
            <span
              key={f.label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70
                         border border-slate-700/50 text-sm text-slate-300"
            >
              {f.icon}
              {f.label}
            </span>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ────────────────────────────────────────────────────── */}
      <section className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Code2 size={18} className="text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Tech Stack</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {TECH_STACK.map((t) => (
            <div
              key={t.label}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50
                         border border-slate-700/40"
            >
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider
                               bg-emerald-500/10 px-2 py-1 rounded-md whitespace-nowrap mt-0.5">
                {t.label}
              </span>
              <span className="text-sm text-slate-300">{t.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Developer ─────────────────────────────────────────────────────── */}
      <section className="glass-green rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <User size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Developer</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20
                          border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-black text-emerald-400">F</span>
          </div>

          {/* Info */}
          <div className="space-y-3 flex-1">
            <div>
              <h3 className="text-2xl font-bold text-white">Faheem Shiledar</h3>
              <p className="text-slate-400 text-sm mt-1">
                Full-stack developer passionate about building AI-powered web
                applications. AgriSense was designed and developed as a
                portfolio project to demonstrate real-world AI integration in
                agriculture.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:faheemshiledar@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/70
                           border border-slate-700/50 text-sm text-slate-300
                           hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <Mail size={14} />
                faheemshiledar@gmail.com
              </a>
              <a
                href="https://github.com/faheemshiledar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/70
                           border border-slate-700/50 text-sm text-slate-300
                           hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              >
                <Github size={14} />
                github.com/faheemshiledar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer note ───────────────────────────────────────────────────── */}
      <p className="text-center text-slate-600 text-xs pb-4">
        AgriSense AI · Open source · Built with Groq, Supabase &amp; ❤️ for farmers everywhere
      </p>
    </div>
  );
}
