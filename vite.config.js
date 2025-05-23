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
      // Proxy requests starting with /crop to backend crop blueprint
      "/crop": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy requests starting with /fertilizer to backend fertilizer blueprint
      "/fertilizer": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      // Proxy requests starting with /plant to backend plant disease blueprint
      "/plant": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
