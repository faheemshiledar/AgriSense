import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In local dev, proxy /api/* to a local Express server on port 3001
      // For Vercel deployment, this proxy is not needed (Vercel handles routing)
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
