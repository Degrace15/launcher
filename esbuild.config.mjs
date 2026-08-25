import { build } from "esbuild";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const plugin = JSON.parse(
  await readFile("./plugin.json", "utf8")
);

await mkdir("./dist", {
  recursive: true
});

await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  minify: true,
  format: "iife",
  outfile: "dist/main.js",
  target: "es2020",
  legalComments: "none"
});

const files = [
  "dist/main.js"
];

const optionalFiles = [
  "readme.md",
  "CHANGELOG.md",
  "icon.png"
];

for (const file of optionalFiles) {
  try {
    await readFile(file);
    files.push(file);
  } catch {}
}

plugin.files = files;

await writeFile(
  "plugin.json",
  JSON.stringify(plugin, null, 2) + "\n"
);

console.log("Launcher build completed.");
