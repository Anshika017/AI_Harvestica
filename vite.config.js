import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/predict": {
        target: "http://localhost:5002", // Plant disease detection Flask backend
        changeOrigin: true,
        secure: false,
      },
      "/fertilizer-recommendation": {
        target: "http://localhost:5003", // Fertilizer recommendation Flask backend
        changeOrigin: true,
        secure: false,
      },
      "/crop-recommend": {
        target: "http://localhost:5001", // Crop recommendation Flask backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
