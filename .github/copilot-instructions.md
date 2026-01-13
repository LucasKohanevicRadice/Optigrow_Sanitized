# Copilot Instructions for OptiGrow

## Purpose

Plant monitoring system with sensor data tracking, optimal growing ranges, and real-time environment management.

## Session startup rule

- On a new conversation, if I do not already have the current .copilot-manifest.json and .copilot/README.md in memory, I will ask you to provide them before performing any full-repo analysis.
- Example prompt I will use: "Please paste the contents of .copilot-manifest.json and .copilot/README.md (or run: Get-Content .copilot-manifest.json -Raw | Set-Clipboard && Get-Content .copilot/README.md -Raw | Set-Clipboard)."

## Architecture Overview

**Full-stack plant monitoring system**:

- Backend: Express + Mongoose (Entry: `Backend/index.js`)
- Frontend: Vite + React with Material-UI (Entry: `Frontend/src/main.jsx`)
- Database: MongoDB with two main collections: `GeneralPlantInfo` and `GrowEnvironments`
- State Management: Redux Toolkit + React Query for server state

## Data Models & Relationships

**Core entities**:

- `GeneralPlantInfo`: Species + growMedium combinations with optimal ranges (pH, EC, humidity)
- `GrowEnvironment`: Actual growing setups with current/historical sensor data
- **Key pattern**: Both models share `optimalRangeSchema` with min/max structure

**Critical data flows**:

1. Plant info defines optimal ranges → used to validate grow environment readings
2. Sensor readings stored in `sensorReadingHistory` array with timestamps
3. Current values tracked separately in `currentValues` object

## Development Commands

**Primary Environment: PowerShell**

- Default to PowerShell syntax for all commands
- Use semicolon (`;`) for command chaining, not `&&`
- Specify alternative shells when PowerShell is not suitable

```powershell
# Backend (from Backend/)
npm run dev          # Development with nodemon
node index.js        # Production start

# Frontend (from Frontend/)
npm run dev          # Vite dev server with --host flag
npm run build        # Production build
npm run preview      # Preview production build

# Multi-command examples (PowerShell syntax)
cd Backend; npm run dev                    # Chain with semicolon
Get-Content .env -Raw | Set-Clipboard     # PowerShell-specific syntax
```

**When to use alternative shells:**

- **Git Bash/WSL**: Complex shell scripting, Unix-style piping
- **Command Prompt**: Legacy batch operations, Windows-specific tools
- **Always specify** when recommending non-PowerShell commands

## API Architecture

**RESTful endpoints**:

- `/api/plants` → `plantsRoutes` (PlantInfo CRUD)
- `/api/growEnvs` → `growEnvRoutes` (GrowEnvironment CRUD)
- `/dev` → Development-only routes (NODE_ENV !== 'production')

**Pattern**: Routes → Controllers → Services → Models

- Controllers handle HTTP concerns, delegate business logic to services
- Services contain database operations and business logic
- All routes use global error handler middleware

## Frontend Patterns

**React Query integration**:

- Custom hooks pattern: `useFetchGrowEnvs`, `useCreateGrowEnv`
- 5-minute stale time for sensor data
- Automatic cache invalidation after mutations

**Component structure**:

- Pages in `Frontend/src/router/pages/`
- Reusable components in `Frontend/src/components/`
- API calls centralized in `Frontend/src/api/`

**Material-UI theming**:

- Custom theme in `Frontend/src/Styles/theme.js`
- Component constants in `Frontend/src/Styles/componentConstants.js`

## Environment Configuration

**Critical variables**:

- Backend `.env`: `MONGODB_ATLAS_ADMIN_URI`, `VITE_FRONTEND_URL`, `PORT`
- Frontend `.env`: `VITE_API_URL`
- CORS configured to allow frontend URL from backend env

## Sensor Data Conventions

**Optimal ranges structure** (both models):

```javascript
optimalRanges: {
  ph: { min: Number, max: Number },
  ec: { min: Number, max: Number },
  humidity: { min: Number, max: Number },
  temperature: { min: Number, max: Number } // GrowEnvironment only
}
```

**Sensor reading pattern**:

- Current values tracked in `currentValues` with `currentDateTime`
- Historical data in `sensorReadingHistory` array
- Always include timestamp (`dateTime` field)

## Naming Conventions

- Custom hooks: Must start with `use` (e.g., `useFetchGrowEnvs`, `useCreateGrowEnv`)
- React components: PascalCase with descriptive folder structure
- API endpoints: RESTful with plural nouns (`/api/plants`, `/api/growEnvs`)
- Database models: CamelCase with descriptive names (`GeneralPlantInfo`, `GrowEnvironment`)

## File Organization Patterns

**Backend structure**:

- Routes define endpoints → Controllers handle requests → Services contain business logic
- Keep related functionality together (plants/, growEnvs/ domains)
- Dev-only routes separate from production API

**Frontend structure**:

- Pages correspond to routes in `router/pages/`
- Shared components in `components/` with feature folders
- API integration layer in `api/` with matching backend endpoints

## Common Integration Points

**When adding new features**:

1. **New plant species**: Add to `GeneralPlantInfo` with optimal ranges
2. **New sensors**: Extend `optimalRanges` and `currentValues` in both models
3. **New pages**: Add route in `router.jsx` + corresponding page component
4. **New API endpoints**: Follow Route → Controller → Service pattern

**Database queries**: Always use services layer, not direct Mongoose calls in controllers

## Development Workflows

**Seeding data**: Use `/dev` routes (development only)
**Testing API**: All endpoints mounted under `/api/` prefix
**Environment switching**: Controlled by `NODE_ENV` environment variable

## Security & Environment

- **Never commit `.env` files** - use environment variables
- CORS configured for specific frontend URL (not wildcard)
- MongoDB connection uses Atlas with proper authentication
- Development routes automatically disabled in production

## Repository Automation

- Auto-generates `.copilot-manifest.json` and `.copilot/README.md` on commits
- Hooks: **Once configured, work automatically** - only run `scripts/bootstrap.ps1` on new clones
- Bootstrap script: `scripts/bootstrap.ps1` sets up development environment (one-time per machine)
- Security scanning via `detect-secrets` in GitHub Actions

## When Asking for Changes

- **Database changes**: Specify which model (`GeneralPlantInfo` vs `GrowEnvironment`)
- **Frontend changes**: Include component path (e.g., `SystemDetails/SystemDetails.jsx`)
- **API changes**: Mention target domain (`plants` vs `growEnvs`)
- **Environment changes**: Specify Backend vs Frontend `.env` requirements

## Quick Debugging Commands

**PowerShell (Default):**

```powershell
# Check MongoDB connection
cd Backend; node -e "require('dotenv').config(); console.log(process.env.MONGODB_ATLAS_ADMIN_URI)"

# Verify frontend API connection
cd Frontend; node -e "console.log('API URL:', process.env.VITE_API_URL || 'http://localhost:3001')"

# Test API endpoints (PowerShell using Invoke-RestMethod)
Invoke-RestMethod -Uri "http://localhost:3001/api/plants" -Method GET
Invoke-RestMethod -Uri "http://localhost:3001/api/growEnvs" -Method GET

# Alternative: curl (if available)
curl http://localhost:3001/api/plants
curl http://localhost:3001/api/growEnvs
```

**Git Bash/WSL (when needed):**

```bash
# Complex piping or shell operations
cat .env | grep MONGODB_ATLAS_ADMIN_URI
find . -name "*.js" -type f | head -10
```

## Communication & Response Styling Rules

### **Structured Technical Communication**

Use clear visual hierarchy with bold headers, status indicators, and organized sections for all responses:

**Response Template Structure:**

1. **Status/Summary** - Lead with current state or key finding
2. **Key Details** - Present important information with visual emphasis
3. **Action Items** - Provide clear next steps when applicable
4. **Supporting Context** - Include background/technical details

**Visual Formatting Standards:**

- **Bold section headers** with clear hierarchical structure
- **Status indicators** (✅ ❌ ⚠️) for immediate clarity
- **Emphasized key terms** and important concepts
- **Numbered/bulleted lists** for step-by-step information
- **Code formatting** with proper syntax highlighting
- **Short, scannable paragraphs** with visual breaks

### **Source Attribution Requirements**

Always include authoritative source links when providing:

- Best practices or architectural guidance
- Technical recommendations or solutions
- Framework-specific patterns or conventions
- Security or performance advice

**Link Format**: Provide official documentation, RFCs, or reputable technical sources with each recommendation.
