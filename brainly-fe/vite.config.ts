import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5174,
    host: true, // Allow external connections
  },
  base: "/", // Crucial for Vercel deployments
  build: {
    outDir: "dist", // Explicit output directory
    emptyOutDir: true, // Clean before building
    sourcemap: true, // Helps with debugging
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
      },
    },
  },
  preview: {
    port: 5175, // Different port for preview
  },
});
