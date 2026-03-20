import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  build: {
    // Reporta cuando un chunk supere 400kb
    chunkSizeWarningLimit: 400,

    rollupOptions: {
      output: {
        // Code splitting manual por dominio para mejorar caching
        manualChunks: {
          // React core
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Framer Motion (librería pesada, separada)
          "vendor-framer": ["framer-motion"],
          // Lucide icons
          "vendor-icons": ["lucide-react"],
          // Animaciones / UI extra
          "vendor-ui": ["react-type-animation"],
        },
        // Nombres con hash para cache-busting
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },

    // Minificación con esbuild (más rápido que terser, bundled con Vite)
    minify: "esbuild",

    // Source maps solo en staging, no en prod
    sourcemap: false,

    // Target moderno — soporta ES2020+
    target: "es2020",
  },

  // Optimización de dependencias en dev
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "framer-motion"],
  },
});
