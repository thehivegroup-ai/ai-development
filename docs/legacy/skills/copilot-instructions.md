# Copilot Instructions (Start Here)

## Authority Order (Highest → Lowest)
1. `.github/copilot-contracts.md`
2. `.github/copilot-workflow.md`
3. `.github/skills/**`
4. `docs/standards/**`
5. Other docs

## Project Overview (Canonical)
# Copilot Instructions for NSA Storage

## Project Overview

NSA Storage is a two-part project:
- **api/**: Fastify-based mock API serving facility, unit, and state data for frontend development and testing.
- **web/**: React + Vite web application for searching, viewing, and comparing self-storage facilities across the US.

## Architecture & Data Flow
- The **web** app fetches data from the **api** (default: `http://localhost:6101`).
- API endpoints include `/facilities`, `/facilities/:id`, `/states`, `/maps/facilities.geojson`, and `/health`.
- Data is mocked in `api/src/data/` (TS, JSON, CSV) and shaped by utility functions in `api/src/utils/`.
- Frontend state and facility types are shared in `web/src/types/facility.ts` and `api/src/types/facility.ts` (keep in sync).

## Developer Workflows
- **API**
  - Dev: `npm run dev` (hot reload)
  - Build: `npm run build`
  - Test: `npm run test` (Vitest)
  - Config: `.env` for `PORT`/`HOST`
- **Web**
  - Dev: `npm run dev`
  - Build: `npm run build`
  - Main entry: `web/src/App.tsx`
  - Tailwind config: `web/tailwind.config.js`

## Project-Specific Patterns
- **API**
  - Route files in `api/src/routes/` match endpoint names.
  - Data files in `api/src/data/` are the single source of truth for mock data.
  - Use utility functions in `api/src/utils/` for filtering and shaping responses.
- **Web**
  - Pages in `web/src/pages/`, components in `web/src/components/` (by feature).
  - API calls via `web/src/services/api.ts`.
  - Use hooks in `web/src/hooks/` for state/data logic (e.g., `useStates`).
  - Tailwind for all styling; no CSS modules or styled-components.

## Integration & Conventions
- Keep facility/unit/state types in sync between API and web.
- Prefer updating mock data in `api/src/data/` and reusing utilities.
- Use RESTful patterns for new endpoints; follow existing route structure.
- For new frontend features, colocate UI and logic in feature folders under `web/src/components/`.

## Examples
- To add a new facility field:
  1. Update `api/src/data/facilities.ts` and type in `api/src/types/facility.ts`.
  2. Sync type in `web/src/types/facility.ts`.
  3. Update API response shaping in `api/src/utils/facilityFilters.ts` if needed.
  4. Update frontend display/components as needed.

---
For more, see `api/README.md` and `web/README.md`.

## Where the rules live
- Contracts: `.github/copilot-contracts.md`
- Workflow protocol: `.github/copilot-workflow.md`
- Skills (procedures that output artifacts): `.github/skills/`
- Standards (coding + documentation conventions): `docs/standards/`
- Parity artifacts output directory (gitignored): `.temp/parity/`

## Parity Guidance (How to succeed)
- Prefer the parity skills under `.github/skills/parity.*`.
- Prefer reusable scripts under `scripts/` once created; use `.temp/` for outputs only.
