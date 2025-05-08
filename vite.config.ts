import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4173,
    historyApiFallback: true  // 추가: SPA 라우팅을 위한 히스토리 API 폴백
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separate vendor chunks
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Separate repository data files
          if (id.includes('/data/')) {
            return 'data';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600, // Increase warning limit to 600kB
  },
}));
