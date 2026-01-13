#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function readJsonIfExists(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    return null;
  }
}

function readFileIfExists(p) {
  try {
    if (!fs.existsSync(p)) return null;
    return fs.readFileSync(p, "utf8");
  } catch (e) {
    return null;
  }
}

function readManifest() {
  const p = path.join(process.cwd(), ".copilot-manifest.json");
  return readJsonIfExists(p);
}

function detectBackendMounts(indexContent) {
  if (!indexContent) return [];
  const mounts = [];
  const mountRegex = /app\.use\(['"`]([^'"`]+)['"`]\s*,\s*([a-zA-Z0-9_\.]+)/g;
  let m;
  while ((m = mountRegex.exec(indexContent)) !== null) {
    mounts.push({ path: m[1], handler: m[2] });
  }
  // also capture simple app.use('/api/plants', plantsRoutes);
  const simpleRegex = /app\.use\(['"`]([^'"`]+)['"`]\s*,\s*([^\)\n]+)\)/g;
  while ((m = simpleRegex.exec(indexContent)) !== null) {
    mounts.push({ path: m[1], handler: m[2].trim() });
  }
  // unique by path
  const seen = new Set();
  return mounts.filter((it) => {
    if (seen.has(it.path)) return false;
    seen.add(it.path);
    return true;
  });
}

function extractModelFields(content) {
  if (!content) return [];
  const fields = [];
  const schemaMatch = content.match(/new\s+Schema\s*\((\{[\s\S]*?\})\s*\)/);
  const objText = schemaMatch ? schemaMatch[1] : null;
  if (!objText) return fields;
  // find keys like name: { or name: String,
  const keyRegex = /([a-zA-Z0-9_]+)\s*:\s*(?:\{|[A-Z][a-zA-Z0-9_]*)/g;
  let mm;
  while ((mm = keyRegex.exec(objText)) !== null) {
    fields.push(mm[1]);
  }
  return Array.from(new Set(fields));
}

function detectEnvKeys(manifest) {
  const found = new Set();
  ((manifest && manifest.envFiles) || []).forEach((e) => {
    if (!e.preview) return;
    e.preview.split(/\r?\n/).forEach((line) => {
      const mm = line.match(/^\s*([^#=]+?)=/);
      if (mm) found.add(mm[1].trim());
    });
  });
  return Array.from(found);
}

function buildReadme(
  manifest,
  backendPkg,
  frontendPkg,
  indexContent,
  modelContent,
  envKeys,
  routesList
) {
  const lines = [];
  lines.push("# OptiGrow");
  lines.push("");
  lines.push(
    "A small project scaffold that provides an Express + Mongoose backend and a Vite + React frontend for managing grow environments and plants."
  );
  lines.push("");
  lines.push("## Architecture");
  lines.push(
    "- Backend: `Backend/` — Express + Mongoose. Entry: `Backend/index.js`"
  );
  lines.push(
    "- Frontend: `Frontend/` — Vite + React. Entry: `Frontend/src/main.jsx`"
  );
  if (backendPkg && backendPkg.name)
    lines.push(
      `- Backend package: ${backendPkg.name}@${backendPkg.version || "unknown"}`
    );
  if (frontendPkg && frontendPkg.name)
    lines.push(
      `- Frontend package: ${frontendPkg.name}@${
        frontendPkg.version || "unknown"
      }`
    );
  lines.push("");
  lines.push("## Quick start (development)");
  lines.push("Requirements: Node.js and npm.");
  lines.push("");
  lines.push("Start the backend:");
  lines.push("```powershell");
  lines.push("cd Backend");
  lines.push("node index.js");
  lines.push("```");
  lines.push("Start the frontend:");
  lines.push("```powershell");
  lines.push("cd Frontend");
  lines.push("npm run dev");
  lines.push("```");
  lines.push("");
  lines.push("## API overview");
  const mounts = detectBackendMounts(indexContent);
  if (mounts && mounts.length) {
    mounts.forEach((m) =>
      lines.push("- Mounted: " + "`" + m.path + "`" + " -> " + m.handler)
    );
  } else {
    lines.push("- No mounts detected in `Backend/index.js`.");
  }
  lines.push("");
  if (routesList && routesList.length) {
    lines.push("Top-level backend route files:");
    routesList.forEach((r) => lines.push(`- ${r}`));
    lines.push("");
  }
  lines.push("## Data models (sample)");
  const modelFields = extractModelFields(modelContent);
  if (modelFields && modelFields.length) {
    lines.push("- GeneralPlantInfo fields:");
    modelFields.forEach((f) => lines.push(`  - ${f}`));
  } else {
    lines.push("- No model fields detected for `GeneralPlantInfo`.");
  }
  lines.push("");
  lines.push("## Environment variables");
  if (envKeys && envKeys.length) {
    envKeys.forEach((k) => lines.push(`- ${k}`));
  } else {
    lines.push(
      "- No env previews found in manifest; check `Backend/.env` and `Frontend/.env` for required variables."
    );
  }
  lines.push("");
  lines.push("## Developer notes");
  lines.push(
    "- The repository auto-generates `.copilot-manifest.json` and `.copilot/README.md` after commits via tracked hooks."
  );
  lines.push(
    "- To enable hooks locally run: `scripts/install-git-hook.ps1` (Windows) or set `git config core.hooksPath .githooks`."
  );
  lines.push(
    "- The generators are in `scripts/` — you can run them manually if hooks do not run."
  );
  lines.push("");
  lines.push("## Security");
  lines.push(
    "- Do not commit secrets. `.copilot-manifest.json` redacts values but treat it as sensitive if tracked."
  );
  lines.push("");
  lines.push("## Where to look next");
  lines.push("- Backend routes: `Backend/routes/`");
  lines.push("- Backend controllers: `Backend/controllers/`");
  lines.push("- Frontend source: `Frontend/src/`");
  return lines.join("\n");
}

try {
  const manifest = readManifest();
  const backendPkg = readJsonIfExists(
    path.join(process.cwd(), "Backend", "package.json")
  );
  const frontendPkg = readJsonIfExists(
    path.join(process.cwd(), "Frontend", "package.json")
  );
  const indexContent = readFileIfExists(
    path.join(process.cwd(), "Backend", "index.js")
  );
  const modelContent =
    readFileIfExists(
      path.join(process.cwd(), "Backend", "models", "GeneralPlantInfo.js")
    ) ||
    readFileIfExists(
      path.join(process.cwd(), "Backend", "models", "GeneralPlantInfo.jsx")
    );
  const envKeys = detectEnvKeys(manifest);
  let routesList = [];
  try {
    const routesDir = path.join(process.cwd(), "Backend", "routes");
    if (fs.existsSync(routesDir))
      routesList = fs.readdirSync(routesDir).filter((f) => f.endsWith(".js"));
  } catch (e) {
    routesList = [];
  }

  const readme = buildReadme(
    manifest,
    backendPkg,
    frontendPkg,
    indexContent,
    modelContent,
    envKeys,
    routesList
  );
  fs.writeFileSync(
    path.join(process.cwd(), "README.md"),
    readme + "\n",
    "utf8"
  );
  console.log("Wrote README.md");
  process.exit(0);
} catch (e) {
  console.error(
    "Failed to generate README.md:",
    e && e.message ? e.message : e
  );
  process.exit(1);
}
