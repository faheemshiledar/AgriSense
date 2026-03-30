import React from "react";
import { Wind, Droplets, Eye, Gauge, CloudRain } from "lucide-react";

function WeatherIcon({ icon, size = 40 }) {
  return (
    <img
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt="weather icon"
      width={size}
      height={size}
      className="drop-shadow"
    />
  );
}

export default function WeatherWidget({ data }) {
  if (!data) return null;
  const { city, country, current, forecast, totalRainfall5d } = data;

  return (
    <div className="glass-green p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider">Weather — Live</p>
          <h3 className="text-xl font-bold text-white mt-0.5">
            {city}, <span className="text-slate-400 font-normal text-base">{country}</span>
          </h3>
          <p className="text-slate-400 text-sm capitalize mt-1">{current.description}</p>
        </div>
        <div className="text-right flex items-center gap-1">
          {current.icon && <WeatherIcon icon={current.icon} size={52} />}
          <span className="text-4xl font-bold text-white">{current.temp}°</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Droplets size={14} className="text-blue-400" />,  label: "Humidity",    value: `${current.humidity}%` },
          { icon: <Wind     size={14} className="text-slate-400" />, label: "Wind",        value: `${current.wind} m/s` },
          { icon: <CloudRain size={14} className="text-cyan-400" />, label: "Rain 5d",     value: `${totalRainfall5d} mm` },
          { icon: <Gauge    size={14} className="text-amber-400" />, label: "Pressure",    value: `${current.pressure} hPa` },
        ].map((s) => (
          <div key={s.label} className="bg-slate-800/60 rounded-xl px-3 py-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">{s.icon}<span className="text-xs text-slate-400">{s.label}</span></div>
            <p className="text-sm font-semibold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* 5-day forecast */}
      {forecast && forecast.length > 0 && (
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">5-Day Forecast</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {forecast.slice(0, 5).map((day) => (
              <div
                key={day.date}
                className="flex-shrink-0 bg-slate-800/50 rounded-xl px-3 py-2 text-center min-w-[70px]"
              >
                <p className="text-xs text-slate-400">
                  {new Date(day.date + "T12:00:00").toLocaleDateString("en", { weekday: "short" })}
                </p>
                {day.icon && <WeatherIcon icon={day.icon} size={28} />}
                <p className="text-sm font-semibold text-white">{day.temp}°</p>
                <p className="text-xs text-blue-400">{day.humidity}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
