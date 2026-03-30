import React from "react";
import {
  Sprout, CloudSun, FlaskConical, Microscope,
  BrainCircuit, Network, Mail, User, Code2, Layers, Github,
  ExternalLink, MapPin, GraduationCap, Zap, Globe
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
      <section className="glass-green rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="px-8 py-5 border-b border-emerald-500/20 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <User size={18} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Developer</h2>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar + name row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500/30 to-teal-500/20
                              border border-emerald-500/30 flex items-center justify-center">
                <span className="text-4xl font-black text-emerald-400">F</span>
              </div>
              {/* Online dot */}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full
                               border-2 border-slate-900 animate-pulse" />
            </div>

            {/* Name & bio */}
            <div className="space-y-2 flex-1">
              <div>
                <h3 className="text-2xl font-bold text-white">Faheem Shiledar</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <MapPin size={13} className="text-emerald-400/70" />
                    India
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <GraduationCap size={13} className="text-emerald-400/70" />
                    Engineering Student
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-slate-400">
                    <Zap size={13} className="text-emerald-400/70" />
                    Full-Stack Developer
                  </span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                Passionate about building AI-powered web applications that solve real-world
                problems. AgriSense was designed and developed as a portfolio project to
                demonstrate real-world AI integration in agriculture.
              </p>
            </div>
          </div>

          {/* Contact links */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
              Get in touch
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:faheemshiledar@gmail.com"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                           bg-slate-800/70 border border-slate-700/50 text-sm text-slate-300
                           hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800
                           transition-all duration-200 group"
              >
                <Mail size={15} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                faheemshiledar@gmail.com
              </a>
              <a
                href="https://github.com/faheemshiledar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl
                           bg-slate-800/70 border border-slate-700/50 text-sm text-slate-300
                           hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-slate-800
                           transition-all duration-200 group"
              >
                <Github size={15} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                github.com/faheemshiledar
                <ExternalLink size={11} className="text-slate-600 group-hover:text-emerald-400/60 transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom banner */}
        <div className="px-8 py-4 bg-emerald-500/5 border-t border-emerald-500/20
                        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-slate-500">
            Built with ❤️ for farmers everywhere — open source &amp; free to use
          </p>
          <a
            href="https://github.com/faheemshiledar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-emerald-400/70
                       hover:text-emerald-400 transition-colors"
          >
            <Globe size={11} />
            View on GitHub
            <ExternalLink size={10} />
          </a>
        </div>
      </section>

      {/* ── Footer note ───────────────────────────────────────────────────── */}
      <p className="text-center text-slate-600 text-xs pb-4">
        AgriSense AI · Open source · Built with Groq, Supabase &amp; ❤️ for farmers everywhere
      </p>
    </div>
  );
}
