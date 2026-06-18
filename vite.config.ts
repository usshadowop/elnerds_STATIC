import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// GitHub Pages serves the site under /<repo-name>/. Set base accordingly.
// Override locally with `vite build --base=/` if deploying to a custom domain root.
export default defineConfig({
  base: "/elnerds_STATIC/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
