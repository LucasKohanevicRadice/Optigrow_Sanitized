#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function readManifest() {
  try {
    const p = path.join(process.cwd(), ".copilot-manifest.json");
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return null;
  }
}

function detectEntries(manifest) {
  const files = (manifest && manifest.files) || [];
  return {
    backendEntry:
      files.includes("Backend/index.js") || files.includes("Backend/index.mjs")
        ? files.includes("Backend/index.js")
          ? "Backend/index.js"
          : "Backend/index.mjs"
        : files.find((f) => f.startsWith("Backend/") && f.endsWith(".js")) ||
          "Backend/ (no clear entry) ",
    frontendEntry:
      files.includes("Frontend/src/main.jsx") ||
      files.includes("Frontend/src/main.js")
        ? files.includes("Frontend/src/main.jsx")
          ? "Frontend/src/main.jsx"
          : "Frontend/src/main.js"
        : files.find(
            (f) =>
              f.startsWith("Frontend/src/") &&
              (f.endsWith(".jsx") || f.endsWith(".js"))
          ) || "Frontend/ (no clear entry) ",
  };
}

function detectEnvKeys(manifest) {
  const found = new Set();
  ((manifest && manifest.envFiles) || []).forEach((e) => {
    if (!e.preview) return;
    e.preview.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^\s*([^#=]+?)=/);
      if (m) found.add(m[1].trim());
    });
  });
  if (found.size) return Array.from(found);
  return [
    "MONGODB_ATLAS_ADMIN_URI",
    "MONGODB_ATLAS_READ_WRITE_DB",
    "DATABASE_NAME",
    "VITE_FRONTEND_URL",
    "VITE_API_URL",
  ];
}

function detectTopLevelRoutes() {
  // simple heuristic: list files in Backend/routes/ if present
  try {
    const routesDir = path.join(process.cwd(), "Backend", "routes");
    if (!fs.existsSync(routesDir)) return [];
    return fs
      .readdirSync(routesDir)
      .filter((f) => f.endsWith(".js"))
      .map((f) => f);
  } catch (e) {
    return [];
  }
}

function summarize(manifest) {
  const entries = detectEntries(manifest);
  const envKeys = detectEnvKeys(manifest);
  const routes = detectTopLevelRoutes();

  const lines = [];
  lines.push("# Copilot repository quick reference");
  lines.push("");
  lines.push("Auto-generated summary:");
  if (!manifest) {
    lines.push("- Manifest not found or invalid.");
    return lines.join("\n");
  }
  lines.push(`- generatedAt: ${manifest.generatedAt || "unknown"}`);
  lines.push(`- repoRoot: ${manifest.repoRoot || "."}`);
  lines.push(`- filesCount: ${manifest.filesCount || 0}`);
  if (manifest.packageRoot && manifest.packageRoot.name) {
    lines.push(
      `- package: ${manifest.packageRoot.name}@${manifest.packageRoot.version}`
    );
  }
  lines.push("");
  lines.push("## Entry points (detected)");
  lines.push(`- Backend: \`${entries.backendEntry}\``);
  lines.push(`- Frontend: \`${entries.frontendEntry}\``);
  lines.push("");
  lines.push("## Important env variable names (detected or suggested)");
  envKeys.forEach((k) => lines.push(`- ${k}`));
  lines.push("");
  if (routes && routes.length) {
    lines.push("## Top-level route files (Backend/routes)");
    routes.slice(0, 20).forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }
  lines.push("## Useful commands");
  lines.push("- Start backend: `cd Backend && node index.js`");
  lines.push("- Start frontend: `cd Frontend && npm run dev`");
  lines.push("");
  lines.push("## Notes");
  lines.push(
    "- Manifest contains a compact file list and masked previews of any `.env*` files. Values are redacted."
  );
  lines.push(
    "- If you want fuller context, run the generators locally or paste the manifest contents into the conversation."
  );

  return lines.join("\n");
}

function writeReadme(text) {
  const dir = path.join(process.cwd(), ".copilot");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "README.md"), text + "\n", "utf8");
}

try {
  const manifest = readManifest();
  const text = summarize(manifest);
  writeReadme(text);
  console.log("Updated .copilot/README.md");
  process.exit(0);
} catch (e) {
  console.error(
    "Failed to update copilot readme:",
    e && e.message ? e.message : e
  );
  process.exit(1);
}
