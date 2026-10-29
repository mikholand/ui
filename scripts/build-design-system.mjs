// Собирает файлы для дизайн-системы mikholand UI в Claude (design-system/):
//   components/bundle.js   — core + React-обёртки одним классическим скриптом, window.MikholandUI;
//                            react, react-dom и jsx-runtime берутся из window.React / window.ReactDOM
//   components/bundle.css  — шрифт + стили компонентов (токены система генерирует сама из tokens.json)
//   components/index.d.ts  — типы React-обёрток и core: по ним показываются пропсы компонентов
//   tokens.json            — копия tokens/tokens.json с отметкой источника
// Запуск: npm run build && node scripts/build-design-system.mjs
import { build } from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "design-system");
mkdirSync(join(out, "components"), { recursive: true });

const COMPONENTS = ["Button", "Input", "Select", "Checkbox", "Segmented", "Tabs", "Status", "AppShell", "Card", "Kpi", "Table", "Menu", "Popover", "Pagination", "Stepper", "StepLog", "Progress"];

const globals = {
  name: "react-globals",
  setup(b) {
    b.onResolve({ filter: /^(react|react-dom|react-dom\/client|react\/jsx-runtime)$/ }, (a) => ({ path: a.path, namespace: "g" }));
    b.onLoad({ filter: /.*/, namespace: "g" }, (a) => {
      if (a.path === "react/jsx-runtime")
        return {
          contents: `var R = window.React;
function jsx(type, props, key) { var p = {}; for (var k in props) p[k] = props[k]; if (key !== undefined) p.key = key; return R.createElement(type, p); }
module.exports = { jsx: jsx, jsxs: jsx, Fragment: R.Fragment };`,
          loader: "js",
        };
      return { contents: `module.exports = ${a.path === "react" ? "window.React" : "window.ReactDOM"};`, loader: "js" };
    });
  },
};

const entry = `export * from "./src/core/index.js";\nexport * from "./src/react/index.ts";\n`;
const result = await build({
  stdin: { contents: entry, resolveDir: root, loader: "ts" },
  bundle: true,
  format: "iife",
  globalName: "MikholandUI",
  minify: true,
  target: "es2019",
  jsx: "automatic",
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [globals],
  write: false,
  logLevel: "warning",
});
const sha = execSync("git rev-parse --short HEAD", { cwd: root }).toString().trim();
const header = `/* @ds-bundle: ${JSON.stringify({ format: 4, namespace: "MikholandUI", components: COMPONENTS.map((name) => ({ name })) })} */`;
let js = result.outputFiles[0].text;
// Бандл встраивается инлайном: литералы закрытия скрипта и HTML-комментария недопустимы
js = js.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "\\x3C!--");
writeFileSync(join(out, "components/bundle.js"), `${header}\n/* mikholand UI · github.com/mikholand/ui@${sha} */\n${js}`);

const fonts = readFileSync(join(root, "dist/fonts.css"), "utf8").trim();
const components = readFileSync(join(root, "dist/components.css"), "utf8").trim();
writeFileSync(join(out, "components/bundle.css"), `${fonts}\n\n/* mikholand UI · github.com/mikholand/ui@${sha} · стили компонентов; токены — tokens.css */\n${components}\n`);

const reactDts = readFileSync(join(root, "dist/react.d.ts"), "utf8");
const coreDts = readFileSync(join(root, "src/core/index.d.ts"), "utf8");
writeFileSync(
  join(out, "components/index.d.ts"),
  `// mikholand UI · github.com/mikholand/ui@${sha}\n// React: import { … } from "@mikholand/ui/react". В превью и бандле — window.MikholandUI.\n\n${reactDts}\n// ---- Поведение без React (window.MikholandUI.init и др.) ----\n${coreDts}`
);

const tokens = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
tokens.meta = {
  source: "github",
  repo: "mikholand/ui",
  ref: `main@${sha}`,
  paths: { tokens: ["tokens/tokens.json"], styles: ["src/css"], docs: ["docs/guidelines.md", "docs/components"] },
  components: Object.fromEntries(COMPONENTS.map((c) => [c, "src/react/index.ts"])),
  synced: new Date().toISOString().slice(0, 10),
};
writeFileSync(join(out, "tokens.json"), JSON.stringify(tokens, null, 1) + "\n");
console.log(`design-system: bundle.js ${(js.length / 1024).toFixed(0)} KB @ ${sha}`);
