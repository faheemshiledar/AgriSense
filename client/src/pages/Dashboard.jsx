import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UploadZone from "../components/UploadZone";
import WeatherWidget from "../components/WeatherWidget";
import {
  analyzeSoil, analyzeDisease, fetchWeather, getRecommendations
} from "../services/apiService";
import {
  MapPin, Search, Sprout, Microscope, Zap,
  CheckCircle, Loader2, AlertCircle, FlaskConical
} from "lucide-react";

// Multi-step progress indicator shown during analysis
const STEPS = [
  "Preprocessing images…",
  "Running soil transfer learning model…",
  "Fetching live weather data…",
  "Analyzing leaf for diseases…",
  "Generating crop recommendations with AI…",
  "Building explainable AI insights…",
];

export default function Dashboard() {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [soilFile,   setSoilFile]   = useState(null);
  const [leafFile,   setLeafFile]   = useState(null);
  const [city,       setCity]       = useState("");
  const [weather,    setWeather]    = useState(null);
  const [wxLoading,  setWxLoading]  = useState(false);
  const [wxError,    setWxError]    = useState("");
  const [analyzing,  setAnalyzing]  = useState(false);
  const [step,       setStep]       = useState(0);
  const [error,      setError]      = useState("");

  const handleWeatherFetch = async () => {
    if (!city.trim()) return;
    setWxLoading(true);
    setWxError("");
    try {
      const data = await fetchWeather(city.trim());
      setWeather(data);
    } catch (err) {
      setWxError(err.message || "Could not fetch weather.");
    } finally {
      setWxLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!soilFile) { setError("Please upload a soil image."); return; }
    if (!weather)  { setError("Please fetch weather data first."); return; }
    setError("");
    setAnalyzing(true);

    try {
      // Step 1-2: Soil
      setStep(0); await delay(400);
      setStep(1);
      const soilResult = await analyzeSoil(soilFile);

      // Step 3: Weather already fetched
      setStep(2); await delay(300);

      // Step 4: Disease (optional - if leaf uploaded)
      setStep(3);
      let diseaseResult = null;
      if (leafFile) {
        diseaseResult = await analyzeDisease(leafFile);
      }

      // Step 5-6: Recommendations
      setStep(4);
      const recResult = await getRecommendations(soilResult, weather, city);
      setStep(5); await delay(300);

      navigate("/results", {
        state: {
          soilData:        soilResult,
          weatherData:     weather,
          diseaseData:     diseaseResult,
          recommendations: recResult.recommendations,
          location:        city,
        },
      });
    } catch (err) {
      setError(err.message || "Analysis failed. Please check your API keys and try again.");
      setAnalyzing(false);
    }
  };

  const canAnalyze = soilFile && weather && !analyzing;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Hello, <span className="text-emerald-400">{user?.email?.split("@")[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">
          Upload your farm images and get AI-powered insights in seconds.
        </p>
      </div>

      {/* ── Analysis overlay ── */}
      {analyzing && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm
                        flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
          <div className="text-center space-y-3 max-w-sm">
            <p className="text-white font-semibold text-lg">AI Analysis Running…</p>
            {STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-2.5 text-sm transition-all
                ${i < step ? "text-emerald-400" : i === step ? "text-white" : "text-slate-600"}`}>
                {i < step
                  ? <CheckCircle size={15} className="text-emerald-400 flex-shrink-0" />
                  : i === step
                    ? <Loader2 size={15} className="animate-spin text-emerald-400 flex-shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full border border-slate-700 flex-shrink-0" />
                }
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error banner ── */}
      {error && (
        <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20
                        rounded-xl p-4 mb-6 text-sm text-red-400">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* ── Step 1: Upload Images ── */}
        <section className="glass-green p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">1</div>
            <div>
              <h2 className="font-semibold text-white">Upload Farm Images</h2>
              <p className="text-slate-500 text-xs">Soil image is required · Leaf image is optional (for disease check)</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadZone
              label="Soil Image"
              hint="Photo of your soil sample"
              onFileSelect={setSoilFile}
              icon={<FlaskConical size={24} className="text-amber-400" />}
            />
            <UploadZone
              label="Leaf Image (optional)"
              hint="For crop disease detection"
              onFileSelect={setLeafFile}
              icon={<Microscope size={24} className="text-red-400" />}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span>✓ JPG, PNG, WEBP supported</span>
            <span>·</span>
            <span>✓ Images resized automatically</span>
            <span>·</span>
            <span>✓ Max 10 MB</span>
          </div>
        </section>

        {/* ── Step 2: Location & Weather ── */}
        <section className="glass-green p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-xs font-bold text-white">2</div>
            <div>
              <h2 className="font-semibold text-white">Your Farm Location</h2>
              <p className="text-slate-500 text-xs">Used to fetch real-time weather and climate data</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleWeatherFetch()}
                placeholder="Enter city name (e.g. Pune, Mumbai, Delhi)"
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={handleWeatherFetch}
              disabled={!city.trim() || wxLoading}
              className="btn-secondary flex items-center gap-2 px-5 whitespace-nowrap flex-shrink-0"
            >
              {wxLoading
                ? <><span className="w-4 h-4 border-2 border-slate-500 border-t-white rounded-full animate-spin" /> Fetching…</>
                : <><Search size={16} /> Get Weather</>
              }
            </button>
          </div>

          {wxError && (
            <p className="text-red-400 text-sm mt-2 flex items-center gap-1.5">
              <AlertCircle size={13} />{wxError}
            </p>
          )}

          {weather && (
            <div className="mt-4">
              <WeatherWidget data={weather} />
            </div>
          )}
        </section>

        {/* ── Step 3: Analyze ── */}
        <section className="glass-green p-6">
          <div className="flex items-center gap-2 mb-5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white
              ${canAnalyze ? "bg-emerald-500" : "bg-slate-700"}`}>3</div>
            <div>
              <h2 className="font-semibold text-white">Run AI Analysis</h2>
              <p className="text-slate-500 text-xs">Soil analysis + weather + disease detection + recommendations</p>
            </div>
          </div>

          {/* Checklist */}
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              { label: "Soil image",    done: !!soilFile },
              { label: "Leaf image",    done: !!leafFile, optional: true },
              { label: "Weather data",  done: !!weather },
            ].map((item) => (
              <div key={item.label}
                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border
                     ${item.done
                       ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                       : item.optional
                         ? "bg-slate-800/50 border-slate-700 text-slate-500"
                         : "bg-slate-800/50 border-slate-700 text-slate-500"}`}>
                {item.done
                  ? <CheckCircle size={12} />
                  : <div className="w-3 h-3 rounded-full border border-current" />
                }
                {item.label}
                {item.optional && !item.done && <span className="text-slate-600">(optional)</span>}
              </div>
            ))}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            <Zap size={20} />
            Analyze My Farm
          </button>

          {!soilFile && (
            <p className="text-center text-xs text-slate-600 mt-3">Upload a soil image to continue</p>
          )}
          {soilFile && !weather && (
            <p className="text-center text-xs text-slate-600 mt-3">Fetch weather data to continue</p>
          )}
        </section>
      </div>
    </div>
  );
}

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
