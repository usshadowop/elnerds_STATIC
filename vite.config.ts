import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "node:fs";
import path from "node:path";

// `virtual:public-files` exports the path of every file under public/ (the
// files served as-is, like /email/archive/…), read at build time so /library
// lists them without anyone keeping a list by hand.
function publicFiles(): Plugin {
  const id = "virtual:public-files";
  const resolved = "\0" + id;
  const root = path.resolve(__dirname, "public");
  const walk = (dir: string): string[] =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const full = path.join(dir, e.name);
      return e.isDirectory() ? walk(full) : [path.relative(root, full).split(path.sep).join("/")];
    });
  return {
    name: "public-files",
    resolveId: (source) => (source === id ? resolved : undefined),
    load: (source) => (source === resolved ? `export default ${JSON.stringify(walk(root).sort())};` : undefined),
  };
}

// Served from the elnerds.com custom domain root.
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), publicFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
