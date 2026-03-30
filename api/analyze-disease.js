// api/analyze-disease.js — Vercel Serverless Function
// Simulates ResNet-50 plant disease classification, then uses Groq for treatment plan

export const config = { api: { bodyParser: { sizeLimit: "10mb" } } };

// ── Simulated ResNet-50 Disease Classification ────────────────────────────────
function simulateResNet(imageSizeBytes) {
  const diseases = [
    {
      name: "Early Blight",
      scientificName: "Alternaria solani",
      confidence: 0.87,
      severity: "Moderate",
      affectedCrop: "Tomato / Potato",
      category: "Fungal",
    },
    {
      name: "Late Blight",
      scientificName: "Phytophthora infestans",
      confidence: 0.92,
      severity: "High",
      affectedCrop: "Tomato / Potato",
      category: "Oomycete",
    },
    {
      name: "Leaf Rust",
      scientificName: "Puccinia triticina",
      confidence: 0.81,
      severity: "Low",
      affectedCrop: "Wheat / Barley",
      category: "Fungal",
    },
    {
      name: "Powdery Mildew",
      scientificName: "Erysiphe cichoracearum",
      confidence: 0.85,
      severity: "Moderate",
      affectedCrop: "Cucumber / Squash",
      category: "Fungal",
    },
    {
      name: "Bacterial Spot",
      scientificName: "Xanthomonas campestris",
      confidence: 0.76,
      severity: "Moderate",
      affectedCrop: "Pepper / Tomato",
      category: "Bacterial",
    },
    {
      name: "Healthy",
      scientificName: "N/A",
      confidence: 0.97,
      severity: "None",
      affectedCrop: "General",
      category: "Healthy",
    },
    {
      name: "Cercospora Leaf Spot",
      scientificName: "Cercospora beticola",
      confidence: 0.79,
      severity: "Low",
      affectedCrop: "Corn / Soybean",
      category: "Fungal",
    },
    {
      name: "Northern Leaf Blight",
      scientificName: "Exserohilum turcicum",
      confidence: 0.83,
      severity: "Moderate",
      affectedCrop: "Corn",
      category: "Fungal",
    },
  ];

  const index = imageSizeBytes % diseases.length;
  return diseases[index];
}

// ── Groq Call ─────────────────────────────────────────────────────────────────
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
    const imageBytes = Math.round((image.length * 3) / 4);
    const mlResult = simulateResNet(imageBytes);

    if (mlResult.name === "Healthy") {
      return res.status(200).json({
        success: true,
        model: "ResNet-50 (Transfer Learning Simulation)",
        disease: "Healthy",
        confidence: mlResult.confidence,
        severity: "None",
        isHealthy: true,
        analysis: {
          summary: "The plant appears healthy with no visible signs of disease.",
          symptoms: [],
          treatment: ["Continue regular watering", "Maintain proper fertilization", "Monitor regularly"],
          prevention: ["Rotate crops seasonally", "Ensure proper drainage", "Keep leaves dry"],
          urgency: "None",
          farmer_explanation: "Great news! Your plant looks healthy. Keep up your current care routine.",
        },
      });
    }

    const prompt = `You are an expert plant pathologist AI assistant.

A ResNet-50 deep learning model has detected a plant disease:

Disease: ${mlResult.name}
Scientific Name: ${mlResult.scientificName}
Confidence: ${Math.round(mlResult.confidence * 100)}%
Severity: ${mlResult.severity}
Affected Crop: ${mlResult.affectedCrop}
Category: ${mlResult.category} disease

Provide a complete treatment and prevention guide. Return ONLY a valid JSON object:
{
  "summary": "2-3 sentence description of this disease and its impact",
  "symptoms": ["symptom 1", "symptom 2", "symptom 3", "symptom 4"],
  "treatment": [
    {"step": 1, "action": "action title", "detail": "detailed instruction"},
    {"step": 2, "action": "action title", "detail": "detailed instruction"},
    {"step": 3, "action": "action title", "detail": "detailed instruction"}
  ],
  "products": ["product or chemical 1", "product or chemical 2"],
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3"],
  "urgency": "Low/Medium/High/Critical",
  "spread_risk": "Low/Medium/High",
  "yield_impact": "estimated % yield loss if untreated",
  "farmer_explanation": "Simple 1-2 sentence explanation a non-expert farmer would understand",
  "xai_factors": [
    {"factor": "Infection Pattern", "observation": "what the model detected", "significance": "why this matters"},
    {"factor": "Severity Indicators", "observation": "visible signs", "significance": "disease stage"}
  ]
}`;

    const groqRaw = await callGroq(prompt);
    let groqData = {};
    try { groqData = JSON.parse(groqRaw); } catch { groqData = { summary: "Disease detected.", urgency: "Medium" }; }

    return res.status(200).json({
      success: true,
      model: "ResNet-50 (Transfer Learning Simulation)",
      disease: mlResult.name,
      scientificName: mlResult.scientificName,
      confidence: mlResult.confidence,
      severity: mlResult.severity,
      affectedCrop: mlResult.affectedCrop,
      category: mlResult.category,
      isHealthy: false,
      analysis: groqData,
    });
  } catch (err) {
    console.error("Disease analysis error:", err);
    return res.status(500).json({ error: "Disease analysis failed: " + err.message });
  }
}
