// vite.config.ts
import { defineConfig } from "file:///Users/kimsihun/myworkingdir/project/bodhi-meditation-app/node_modules/vite/dist/node/index.js";
import react from "file:///Users/kimsihun/myworkingdir/project/bodhi-meditation-app/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///Users/kimsihun/myworkingdir/project/bodhi-meditation-app/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/Users/kimsihun/myworkingdir/project/bodhi-meditation-app";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 4173,
    historyApiFallback: true
    // 추가: SPA 라우팅을 위한 히스토리 API 폴백
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/data/")) {
            return "data";
          }
        }
      }
    },
    chunkSizeWarningLimit: 600
    // Increase warning limit to 600kB
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMva2ltc2lodW4vbXl3b3JraW5nZGlyL3Byb2plY3QvYm9kaGktbWVkaXRhdGlvbi1hcHBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9raW1zaWh1bi9teXdvcmtpbmdkaXIvcHJvamVjdC9ib2RoaS1tZWRpdGF0aW9uLWFwcC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMva2ltc2lodW4vbXl3b3JraW5nZGlyL3Byb2plY3QvYm9kaGktbWVkaXRhdGlvbi1hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHNlcnZlcjoge1xuICAgIGhvc3Q6IFwiOjpcIixcbiAgICBwb3J0OiA0MTczLFxuICAgIGhpc3RvcnlBcGlGYWxsYmFjazogdHJ1ZSAgLy8gXHVDRDk0XHVBQzAwOiBTUEEgXHVCNzdDXHVDNkIwXHVEMzA1XHVDNzQ0IFx1QzcwNFx1RDU1QyBcdUQ3ODhcdUMyQTRcdUQxQTBcdUI5QUMgQVBJIFx1RDNGNFx1QkMzMVxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIFNlcGFyYXRlIHZlbmRvciBjaHVua3NcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcic7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFNlcGFyYXRlIHJlcG9zaXRvcnkgZGF0YSBmaWxlc1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL2RhdGEvJykpIHtcbiAgICAgICAgICAgIHJldHVybiAnZGF0YSc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCwgLy8gSW5jcmVhc2Ugd2FybmluZyBsaW1pdCB0byA2MDBrQlxuICB9LFxufSkpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE2VixTQUFTLG9CQUFvQjtBQUMxWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sb0JBQW9CO0FBQUE7QUFBQSxFQUN0QjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFDVCxnQkFBZ0I7QUFBQSxFQUNsQixFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGFBQWEsSUFBSTtBQUVmLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTztBQUFBLFVBQ1Q7QUFFQSxjQUFJLEdBQUcsU0FBUyxRQUFRLEdBQUc7QUFDekIsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLEVBQ3pCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
