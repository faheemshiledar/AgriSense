// client/src/services/apiService.js
// All calls to /api/* serverless functions

// Resize image to reduce payload size before sending
async function resizeImageToBase64(file, maxDimension = 512) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) { height = (height / width) * maxDimension; width = maxDimension; }
          else                { width  = (width / height) * maxDimension; height = maxDimension; }
        }

        canvas.width  = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Return just the base64 data (no data: prefix)
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ── Weather ──────────────────────────────────────────────────────────────────
export async function fetchWeather(city) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Weather fetch failed");
  return data;
}

// ── Soil Analysis ─────────────────────────────────────────────────────────────
export async function analyzeSoil(imageFile) {
  const imageBase64 = await resizeImageToBase64(imageFile);
  const res = await fetch("/api/analyze-soil", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Soil analysis failed");
  return data;
}

// ── Disease Detection ─────────────────────────────────────────────────────────
export async function analyzeDisease(imageFile) {
  const imageBase64 = await resizeImageToBase64(imageFile);
  const res = await fetch("/api/analyze-disease", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: imageBase64 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Disease analysis failed");
  return data;
}

// ── Recommendations ───────────────────────────────────────────────────────────
export async function getRecommendations(soilData, weatherData, location) {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ soilData, weatherData, location }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Recommendation failed");
  return data;
}

// ── Federated Learning ────────────────────────────────────────────────────────
export async function getFederatedData() {
  const res = await fetch("/api/federated");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Federated fetch failed");
  return data;
}
