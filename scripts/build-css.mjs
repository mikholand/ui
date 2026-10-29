// Склеивает src/css/*.css в dist/components.css и dist/styles.css (= шрифт + токены + компоненты).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const order = JSON.parse(readFileSync(join(root, "src/css/order.json"), "utf8"));
const read = (n) => readFileSync(join(root, "src/css", `${n}.css`), "utf8").trim();
const fonts = read("fonts");
const components = order.filter((n) => n !== "fonts").map(read).join("\n\n");
const tokens = readFileSync(join(root, "dist/tokens.css"), "utf8").trim();
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/components.css"), components + "\n");
writeFileSync(join(root, "dist/fonts.css"), fonts + "\n");
// @import обязан стоять первым правилом файла
writeFileSync(join(root, "dist/styles.css"), `${fonts}\n\n${tokens}\n\n${components}\n`);
console.log(`css: ${order.length} files → dist/styles.css`);
