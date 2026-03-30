// api/weather.js — Vercel Serverless Function

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { city } = req.query;
  if (!city) return res.status(400).json({ error: "city param required" });

  const KEY = process.env.OPENWEATHER_API_KEY;
  if (!KEY) return res.status(500).json({ error: "OPENWEATHER_API_KEY not set" });

  try {
    // Current weather
    const [currentRes, forecastRes] = await Promise.all([
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`),
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${KEY}&units=metric`),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.json();
      return res.status(404).json({ error: err.message || "City not found" });
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    // Summarise next 5 days (one entry per day at noon)
    const dailySummary = [];
    const seen = new Set();
    for (const item of forecast.list) {
      const date = item.dt_txt.split(" ")[0];
      if (!seen.has(date) && dailySummary.length < 5) {
        seen.add(date);
        dailySummary.push({
          date,
          temp: Math.round(item.main.temp),
          feels_like: Math.round(item.main.feels_like),
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          rain: item.rain?.["3h"] || 0,
          wind: item.wind.speed,
        });
      }
    }

    // Total expected rainfall in next 5 days
    const totalRain = forecast.list
      .slice(0, 40)
      .reduce((sum, i) => sum + (i.rain?.["3h"] || 0), 0);

    return res.status(200).json({
      city: current.name,
      country: current.sys.country,
      current: {
        temp: Math.round(current.main.temp),
        feels_like: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: current.weather[0].icon,
        wind: current.wind.speed,
        visibility: current.visibility,
        pressure: current.main.pressure,
      },
      forecast: dailySummary,
      totalRainfall5d: Math.round(totalRain * 10) / 10,
    });
  } catch (err) {
    console.error("Weather error:", err);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
}
