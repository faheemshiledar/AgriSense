// api/recommend.js — Vercel Serverless Function
// Combines soil + weather data → Groq generates complete farm recommendations

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { soilData, weatherData, location } = req.body || {};
  if (!soilData || !weatherData) {
    return res.status(400).json({ error: "soilData and weatherData are required" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  try {
    const prompt = `You are an expert agronomist AI assistant. Analyze the following farm data and provide comprehensive, actionable recommendations.

═══ SOIL DATA ═══
Soil Type: ${soilData.soilType}
Nitrogen (N): ${soilData.npk?.N} kg/ha
Phosphorus (P): ${soilData.npk?.P} kg/ha  
Potassium (K): ${soilData.npk?.K} kg/ha
pH Level: ${soilData.ph}
Moisture: ${soilData.moisture}%
Soil Quality: ${soilData.analysis?.quality || "Good"}

═══ WEATHER DATA ═══
Location: ${location || weatherData.city || "Unknown"}
Current Temperature: ${weatherData.current?.temp}°C
Humidity: ${weatherData.current?.humidity}%
Condition: ${weatherData.current?.description}
Expected Rainfall (5 days): ${weatherData.totalRainfall5d} mm
Wind Speed: ${weatherData.current?.wind} m/s

Provide complete farm recommendations as a JSON object. Return ONLY valid JSON, no markdown, no explanation outside JSON:
{
  "top_crops": [
    {
      "name": "Crop Name",
      "suitability": 92,
      "season": "Kharif/Rabi/Zaid",
      "duration_days": 90,
      "expected_yield": "3-4 tonnes/hectare",
      "water_requirement": "Low/Medium/High",
      "market_value": "High/Medium/Low",
      "why_recommended": "2 sentence reason specific to THIS soil and weather",
      "key_benefits": ["benefit 1", "benefit 2"]
    },
    {
      "name": "Crop Name 2",
      "suitability": 85,
      "season": "Season",
      "duration_days": 120,
      "expected_yield": "2-3 tonnes/hectare",
      "water_requirement": "Medium",
      "market_value": "Medium",
      "why_recommended": "2 sentence reason",
      "key_benefits": ["benefit 1", "benefit 2"]
    },
    {
      "name": "Crop Name 3",
      "suitability": 78,
      "season": "Season",
      "duration_days": 75,
      "expected_yield": "1-2 tonnes/hectare",
      "water_requirement": "Low",
      "market_value": "High",
      "why_recommended": "2 sentence reason",
      "key_benefits": ["benefit 1", "benefit 2"]
    }
  ],
  "irrigation": {
    "method": "e.g. Drip / Sprinkler / Flood",
    "frequency": "e.g. Every 3 days",
    "amount_liters_per_sqm": 4,
    "best_time": "Early morning (6-8 AM)",
    "adjust_for_rain": true,
    "weekly_schedule": {
      "Mon": "irrigate",
      "Tue": "skip",
      "Wed": "irrigate",
      "Thu": "skip",
      "Fri": "irrigate",
      "Sat": "skip",
      "Sun": "check soil"
    },
    "tips": ["tip 1", "tip 2"]
  },
  "fertilizer": {
    "base_npk": "e.g. 10-26-26",
    "schedule": [
      {"timing": "At sowing", "type": "DAP", "quantity_kg_per_ha": 100, "note": "apply in furrows"},
      {"timing": "30 days after sowing", "type": "Urea", "quantity_kg_per_ha": 60, "note": "top dressing"},
      {"timing": "60 days after sowing", "type": "MOP", "quantity_kg_per_ha": 40, "note": "if K deficient"}
    ],
    "organic_alternatives": ["Vermicompost (2t/ha)", "FYM (10t/ha)"],
    "micronutrients": "e.g. Zinc Sulphate 25kg/ha if pH > 7",
    "caution": "1 sentence important caution"
  },
  "key_factors": [
    {"factor": "Soil pH", "value": "${soilData.ph}", "impact": "positive/negative", "explanation": "why this matters"},
    {"factor": "Temperature", "value": "${weatherData.current?.temp}°C", "impact": "positive/negative", "explanation": "why this matters"},
    {"factor": "Rainfall", "value": "${weatherData.totalRainfall5d}mm", "impact": "positive/negative", "explanation": "why this matters"},
    {"factor": "Nitrogen Level", "value": "${soilData.npk?.N} kg/ha", "impact": "positive/negative", "explanation": "why this matters"},
    {"factor": "Soil Moisture", "value": "${soilData.moisture}%", "impact": "positive/negative", "explanation": "why this matters"}
  ],
  "overall_summary": "3-sentence plain English summary a farmer can understand, explaining why these crops were chosen",
  "warnings": ["any important warning 1", "warning 2"]
}`;

    const apiRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 2048,
      }),
    });

    const groqData = await apiRes.json();
    const raw = groqData.choices?.[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let recommendations = {};
    try {
      recommendations = JSON.parse(cleaned);
    } catch {
      recommendations = { error: "Could not parse recommendations", raw: cleaned.slice(0, 500) };
    }

    return res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error("Recommend error:", err);
    return res.status(500).json({ error: "Recommendation failed: " + err.message });
  }
}
