import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: { index: "src/index.ts", core: "src/core.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: false,
    treeshake: true,
  },
  {
    entry: { react: "src/react/index.ts" },
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    clean: false,
    external: ["react", "react-dom"],
    // Компоненты используют хуки: в Next.js App Router модуль должен быть клиентским
    banner: { js: '"use client";' },
  },
  {
    entry: { "mikholand-ui.global": "src/core/index.js" },
    format: ["iife"],
    globalName: "MikholandUI",
    minify: true,
    clean: false,
    outExtension: () => ({ js: ".js" }),
  },
]);
