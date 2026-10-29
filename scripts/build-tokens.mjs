// Генерирует из tokens/tokens.json:
//   dist/tokens.css   — CSS-переменные (светлая тема на :root, тёмная на [data-theme="dark"])
//   src/tokens.ts     — те же значения для JS/TS (файл генерируется, не править руками)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const t = JSON.parse(readFileSync(join(root, "tokens/tokens.json"), "utf8"));
const themes = t.color.themes.map((x) => x.id);
const [first, ...rest] = themes;
const esc = (n) => n.replace(/\./g, "\\.");
const cssValue = (v) => (typeof v === "string" && v.startsWith("{") ? `var(--${v.slice(1, -1)})` : v);
const valueOf = (tok, theme) => (typeof tok.value === "string" ? tok.value : tok.value[theme] ?? tok.value[first]);

const L = [`/* ${t.name} — generated from tokens.json */`];
L.push(`:root, [data-theme="${first}"] {`);
for (const tok of t.color.tokens) L.push(`  --${esc(tok.name)}: ${cssValue(valueOf(tok, first))};`);
for (const tok of t.shadow?.tokens ?? []) L.push(`  --${esc(tok.name)}: ${valueOf(tok, first)};`);
L.push("}");
for (const theme of rest) {
  L.push(`[data-theme="${theme}"] {`);
  for (const tok of t.color.tokens) {
    const v = valueOf(tok, theme);
    if (v !== valueOf(tok, first)) L.push(`  --${esc(tok.name)}: ${cssValue(v)};`);
  }
  for (const tok of t.shadow?.tokens ?? []) L.push(`  --${esc(tok.name)}: ${valueOf(tok, theme)};`);
  L.push(`  color-scheme: ${theme};`);
  L.push("}");
}
L.push(":root {");
for (const fam of ["spacing", "radius", "size"]) for (const tok of t[fam]?.tokens ?? []) L.push(`  --${esc(tok.name)}: ${tok.value};`);
for (const [key, stack] of Object.entries(t.type.families)) L.push(`  --font-${key}: ${stack};`);
L.push("}");
for (const g of t.type.groups) {
  for (const s of g.styles) {
    const d = [`font-family: var(--font-${s.family ?? g.family})`, `font-size: ${s.fontSize}`, `line-height: ${s.lineHeight}`, `font-weight: ${s.fontWeight}`];
    if (s.letterSpacing) d.push(`letter-spacing: ${s.letterSpacing}`);
    L.push(`.mk-text-${s.name} { ${d.join("; ")}; }`);
  }
}
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/tokens.css"), L.join("\n") + "\n");

// TS: цвета по темам, остальные семейства плоско
const colors = {};
for (const theme of themes) {
  colors[theme] = {};
  for (const tok of t.color.tokens) {
    let v = valueOf(tok, theme);
    while (typeof v === "string" && v.startsWith("{")) {
      const ref = t.color.tokens.find((x) => x.name === v.slice(1, -1));
      v = valueOf(ref, theme);
    }
    colors[theme][tok.name] = v;
  }
}
const flat = (fam) => Object.fromEntries((t[fam]?.tokens ?? []).map((x) => [x.name, x.value]));
const shadows = Object.fromEntries(themes.map((th) => [th, Object.fromEntries((t.shadow?.tokens ?? []).map((x) => [x.name, valueOf(x, th)]))]));
const out = {
  name: t.name,
  themes,
  colors,
  shadows,
  spacing: flat("spacing"),
  radius: flat("radius"),
  size: flat("size"),
  fontFamily: t.type.families,
  textStyles: Object.fromEntries(t.type.groups.flatMap((g) => g.styles.map((s) => [s.name, { fontSize: s.fontSize, lineHeight: s.lineHeight, fontWeight: s.fontWeight, ...(s.letterSpacing ? { letterSpacing: s.letterSpacing } : {}) }]))),
};
writeFileSync(
  join(root, "src/tokens.ts"),
  `// Сгенерировано scripts/build-tokens.mjs из tokens/tokens.json. Не править руками.\nexport const tokens = ${JSON.stringify(out, null, 2)} as const;\n\nexport type Theme = (typeof tokens.themes)[number];\nexport type ColorToken = keyof (typeof tokens.colors)["light"];\n`
);
console.log(`tokens: ${t.color.tokens.length} colors × ${themes.length} themes`);
