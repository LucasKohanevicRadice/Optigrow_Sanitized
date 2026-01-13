# OptiGrow

A small project scaffold that provides an Express + Mongoose backend and a Vite + React frontend for managing grow environments and plants.

## Architecture

- Backend: `Backend/` — Express + Mongoose. Entry: `Backend/index.js`
- Frontend: `Frontend/` — Vite + React. Entry: `Frontend/src/main.jsx`
- Backend package: optigro_backend@1.0.0
- Frontend package: optigro-beta@0.0.0

## Quick start (development)

Requirements: Node.js and npm.

Start the backend:

```powershell
cd Backend
node index.js
```

Start the frontend:

```powershell
cd Frontend
npm run dev
```

## API overview

- Mounted: `/api/plants` -> plantsRoutes
- Mounted: `/api/growEnvs` -> growEnvRoutes
- Mounted: `/dev` -> devRoutes

Top-level backend route files:

- devRoutes.js
- growEnvRoutes.js
- plantsRoutes.js

## Data models (sample)

### GrowEnvironment

```
{
	_id: String,
	species: String,
	growMedium: String,
	growEnvName: String,
	growEnvLocation: String,
	imageMetaData: { url: String, ... },
	optimalRanges: {
		humidity: { min: Number, max: Number },
		ph: { min: Number, max: Number },
		ec: { min: Number, max: Number },
		temperature: { min: Number, max: Number }
	},
	sensorReadingHistory: [
		{
			humidity: Number,
			ph: Number,
			ec: Number,
			temperature: Number,
			dateTime: Date
		}
	],
	createdAt: Date,
	updatedAt: Date
}
```

## Frontend features

- Overview and Details pages show latest sensor readings (humidity, pH, EC, temperature)
- Defensive coding for missing optimal ranges and sensor values ("N/A" fallback)
- Modal-driven deletion for grow environments
- Custom constants for sensor labels/units
- UI built with Material-UI, Redux Toolkit, React Query

## Backend features

- CRUD for grow environments (see `growEnvController.js`, `growEnvService.js`, `growEnvRoutes.js`)

## Developer notes

- Sensor readings and optimal ranges are now handled consistently across all UI components
- See `.github/copilot-instructions.md` for architectural and naming conventions

## Environment variables

- No env previews found in manifest; check `Backend/.env` and `Frontend/.env` for required variables.

## Developer notes

- The repository auto-generates `.copilot-manifest.json` and `.copilot/README.md` after commits via tracked hooks.
- To enable hooks locally run: `scripts/install-git-hook.ps1` (Windows) or set `git config core.hooksPath .githooks`.
- The generators are in `scripts/` — you can run them manually if hooks do not run.

## Security

- Do not commit secrets. `.copilot-manifest.json` redacts values but treat it as sensitive if tracked.

## Where to look next

- Backend routes: `Backend/routes/`
- Backend controllers: `Backend/controllers/`
- Frontend source: `Frontend/src/`
