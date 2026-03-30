// server.js — Local development server only
// Loads .env and routes requests to the same api/ handlers as Vercel
// Run with: node server.js (from project root)

import "dotenv/config";
import express from "express";
import { createRequire } from "module";

const app  = express();
const PORT = 3001;

app.use(express.json({ limit: "10mb" }));

// ── Auto-load all api/*.js handlers ──────────────────────────────────────────
const routes = ["weather", "analyze-soil", "analyze-disease", "recommend", "federated"];

for (const route of routes) {
  const mod = await import(`./api/${route}.js`);
  const handler = mod.default;

  app.all(`/api/${route}`, (req, res) => handler(req, res));
  console.log(`  ✓ Registered: /api/${route}`);
}

app.listen(PORT, () => {
  console.log(`\n🌱 AgriSense dev server running on http://localhost:${PORT}`);
  console.log("   Vite client should run separately with: cd client && npm run dev\n");
});
