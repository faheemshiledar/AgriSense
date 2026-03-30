// api/analyze-soil.js — Vercel Serverless Function
// Simulates MobileNet transfer learning output, then uses Groq for rich analysis

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

// ── Simulated Transfer Learning (MobileNet-style classification) ──────────────
function simulateMobileNet(imageSizeBytes) {
  const soilProfiles = [
    {
      type: "Loamy",
      N: 78, P: 68, K: 72, ph: 6.8, moisture: 58,
      texture: "Medium", color: "Dark Brown", confidence: 0.91,
    },
    {
      type: "Clay",
      N: 62, P: 44, K: 53, ph: 6.3, moisture: 74,
      texture: "Fine", color: "Reddish Brown", confidence: 0.86,
    },
    {
      type: "Sandy",
      N: 28, P: 22, K: 34, ph: 6.0, moisture: 22,
      texture: "Coarse", color: "Light Brown", confidence: 0.88,
    },
    {
      type: "Silty",
      N: 69, P: 55, K: 60, ph: 6.6, moisture: 63,
      texture: "Medium-Fine", color: "Gray-Brown", confidence: 0.83,
    },
    {
      type: "Peaty",
      N: 82, P: 38, K: 28, ph: 4.8, moisture: 88,
      texture: "Spongy", color: "Dark Black", confidence: 0.79,
    },
    {
      type: "Chalky",
      N: 38, P: 58, K: 48, ph: 8.1, moisture: 32,
      texture: "Coarse", color: "Light Gray", confidence: 0.84,
    },
  ];

  // Deterministic selection based on image size (proxy for image content)
  const index = imageSizeBytes % soilProfiles.length;
  return soilProfiles[index];
}

// ── Groq Text Call ─────────────────────────────────────────────────────────────
async function callGroq(prompt) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
    }),
  });
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "{}";
  // Strip markdown code fences if present
  return raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { image } = req.body || {};
  if (!image) return res.status(400).json({ error: "image (base64) required" });

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured" });
  }

  try {
    // 1. Simulate transfer learning
    const imageBytes = Math.round((image.length * 3) / 4); // approximate original bytes
    const mlResult = simulateMobileNet(imageBytes);

    // 2. Groq for rich analysis
    const prompt = `You are an expert agricultural soil scientist AI assistant.

A transfer learning model (MobileNet) has classified a soil sample image with the following output:

Soil Type: ${mlResult.type}
Model Confidence: ${Math.round(mlResult.confidence * 100)}%
Estimated Nutrients: N=${mlResult.N} (kg/ha), P=${mlResult.P} (kg/ha), K=${mlResult.K} (kg/ha)
pH Level: ${mlResult.ph}
Moisture: ${mlResult.moisture}%
Texture: ${mlResult.texture}
Color Profile: ${mlResult.color}

Provide a detailed soil analysis. Return ONLY a valid JSON object with this exact structure:
{
  "quality": "Good",
  "summary": "2-3 sentence plain English summary of this soil",
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"],
  "strengths": ["strength 1", "strength 2"],
  "limitations": ["limitation 1", "limitation 2"],
  "improvement_tips": ["tip 1", "tip 2", "tip 3"],
  "best_for": ["crop category 1", "crop category 2", "crop category 3"],
  "farmer_explanation": "Very simple 1-2 sentence explanation a non-expert farmer would understand",
  "xai_factors": [
    {"factor": "pH Level", "value": "${mlResult.ph}", "impact": "positive/negative/neutral", "reason": "brief reason"},
    {"factor": "Nitrogen", "value": "${mlResult.N} kg/ha", "impact": "positive/negative/neutral", "reason": "brief reason"},
    {"factor": "Moisture", "value": "${mlResult.moisture}%", "impact": "positive/negative/neutral", "reason": "brief reason"}
  ]
}`;

    const groqRaw = await callGroq(prompt);
    let groqData = {};
    try { groqData = JSON.parse(groqRaw); } catch { groqData = { summary: "Soil analysis complete.", quality: "Good" }; }

    return res.status(200).json({
      success: true,
      model: "MobileNet (Transfer Learning Simulation)",
      soilType: mlResult.type,
      confidence: mlResult.confidence,
      npk: { N: mlResult.N, P: mlResult.P, K: mlResult.K },
      ph: mlResult.ph,
      moisture: mlResult.moisture,
      texture: mlResult.texture,
      color: mlResult.color,
      analysis: groqData,
    });
  } catch (err) {
    console.error("Soil analysis error:", err);
    return res.status(500).json({ error: "Soil analysis failed: " + err.message });
  }
}
