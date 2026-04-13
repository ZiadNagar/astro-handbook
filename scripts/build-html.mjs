import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourceRoot = path.join(projectRoot, "src");
const entryFile = path.join(sourceRoot, "pages", "index.html");
const outputFile = path.join(projectRoot, "index.html");

function rel(filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, "/");
}

async function resolveIncludes(content, currentFile, stack = []) {
  const includePattern = /\{\{\s*include:([^}]+)\s*\}\}/g;
  let lastIndex = 0;
  let match;
  let output = "";

  while ((match = includePattern.exec(content)) !== null) {
    const includeRef = match[1].trim();
    const includeFile = path.resolve(sourceRoot, includeRef);

    output += content.slice(lastIndex, match.index);

    if (!includeFile.startsWith(sourceRoot + path.sep)) {
      throw new Error(
        `Invalid include path "${includeRef}" in ${rel(currentFile)}. Includes must stay under src/.`,
      );
    }

    if (stack.includes(includeFile)) {
      const chain = [...stack.map(rel), rel(includeFile)].join(" -> ");
      throw new Error(`Circular include detected: ${chain}`);
    }

    let includeContent;
    try {
      includeContent = await fs.readFile(includeFile, "utf8");
    } catch (error) {
      if (error && error.code === "ENOENT") {
        throw new Error(
          `Missing include "${includeRef}" referenced from ${rel(currentFile)}. Expected file: ${rel(
            includeFile,
          )}`,
        );
      }
      throw error;
    }

    output += await resolveIncludes(includeContent, includeFile, [
      ...stack,
      includeFile,
    ]);
    lastIndex = includePattern.lastIndex;
  }

  output += content.slice(lastIndex);
  return output;
}

async function build() {
  const pageTemplate = await fs.readFile(entryFile, "utf8");
  const resolved = await resolveIncludes(pageTemplate, entryFile, [entryFile]);
  const banner =
    "<!-- AUTO-GENERATED FILE. Edit src/pages/index.html and src/components/* then rebuild. -->\n";
  await fs.writeFile(outputFile, `${banner}${resolved.trimEnd()}\n`, "utf8");
  console.log(`Built ${rel(outputFile)} from ${rel(entryFile)}`);
}

build().catch((error) => {
  console.error("Build failed:", error.message);
  process.exitCode = 1;
});
