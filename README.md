# 🌱 AgriSense AI

**AI-powered smart farming platform** — soil analysis, crop recommendations, disease detection, and federated learning. No IoT sensors needed.

---

## ✨ Features

| Feature | Technology |
|---|---|
| Soil image analysis | Simulated MobileNet + Groq LLaMA |
| Crop recommendations | Groq LLaMA 3.3 70B |
| Disease detection | Simulated ResNet-50 + Groq |
| Weather integration | OpenWeatherMap API |
| Explainable AI | Groq reasoning |
| Federated Learning demo | FedAvg simulation |
| Auth & history | Supabase |

---

## 🚀 Deploy to Vercel (Recommended)

### Step 1 — Get your API keys

1. **Groq API Key** → Sign up free at [console.groq.com](https://console.groq.com)
2. **OpenWeatherMap** → Sign up free at [openweathermap.org/api](https://openweathermap.org/api)
3. **Supabase** → Create a free project at [supabase.com](https://supabase.com)

### Step 2 — Set up Supabase database

1. Go to your Supabase project → **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

That's it — 2 tables created with security rules.

### Step 3 — Deploy to Vercel

```bash
# Option A: Vercel CLI
npm install -g vercel
vercel          # follow the prompts
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new).

### Step 4 — Add environment variables in Vercel

Go to **Vercel → Your Project → Settings → Environment Variables** and add:

| Name | Value |
|---|---|
| `GROQ_API_KEY` | your Groq API key |
| `OPENWEATHER_API_KEY` | your OpenWeatherMap key |
| `VITE_SUPABASE_URL` | your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | your Supabase anon/public key |

### Step 5 — Redeploy

After adding env vars, trigger a redeploy. Your app is live! 🎉

---

## 💻 Run Locally

```bash
# 1. Clone and set up
git clone <your-repo>
cd agrisense

# 2. Install dependencies
npm run install:all

# 3. Create .env file in root
cp .env.example .env
# Fill in your API keys in .env

# 4. Start the dev server (in one terminal)
npm run dev:server

# 5. Start the React app (in another terminal)
npm run dev:client

# Open: http://localhost:5173
```

---

## 📁 Project Structure

```
agrisense/
├── api/                      # Vercel serverless functions
│   ├── weather.js            # OpenWeatherMap integration
│   ├── analyze-soil.js       # Transfer learning + Groq soil analysis
│   ├── analyze-disease.js    # ResNet simulation + Groq disease detection
│   ├── recommend.js          # Groq crop/irrigation/fertilizer recommendations
│   └── federated.js          # Federated learning simulation
├── supabase/
│   └── schema.sql            # Database setup (run once)
├── client/                   # React + Vite frontend
│   └── src/
│       ├── pages/            # Landing, Auth, Dashboard, Results, History
│       ├── components/       # Reusable UI components
│       ├── services/         # API calls, Supabase client
│       └── context/          # Auth context
├── server.js                 # Local dev Express server
├── vercel.json               # Vercel deployment config
└── .env.example              # Environment variable template
```

---

## 🔄 How the AI Pipeline Works

```
User uploads soil image
       ↓
Resized to 512px (client-side)
       ↓
MobileNet simulation (deterministic by image size)
→ Soil type, NPK, pH, moisture
       ↓
Groq LLaMA 3.3 70B
→ Rich analysis, farmer-friendly explanation, XAI factors
       ↓
+ Weather API data (temp, humidity, rainfall)
       ↓
Groq LLaMA 3.3 70B
→ Top 3 crops, irrigation plan, fertilizer schedule
       ↓
Results displayed with confidence bars & explanations
```

---

## 🧠 AI Models Used

- **MobileNet (simulated)** — Soil type classification from image metadata
- **ResNet-50 (simulated)** — Plant disease detection from leaf images
- **Groq LLaMA 3.3 70B** — All reasoning, explanations, and recommendations
- **FedAvg** — Federated learning aggregation across 3 simulated farmer clients

---

## 📝 Sample Test Inputs

- **Soil image**: Any photo of soil, dirt, or sand
- **Leaf image**: Any green plant leaf photo
- **City**: `Pune`, `Mumbai`, `Delhi`, `London`, `New York`

---

## ⚙️ Environment Variables

| Variable | Where to get | Used by |
|---|---|---|
| `GROQ_API_KEY` | console.groq.com | Server (API functions) |
| `OPENWEATHER_API_KEY` | openweathermap.org | Server (API functions) |
| `VITE_SUPABASE_URL` | Supabase project settings | Client (browser) |
| `VITE_SUPABASE_ANON_KEY` | Supabase project settings | Client (browser) |

---

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Recharts
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database & Auth**: Supabase
- **AI**: Groq API (LLaMA 3.3 70B)
- **Weather**: OpenWeatherMap API

---

Built with ❤️ for farmers everywhere.
