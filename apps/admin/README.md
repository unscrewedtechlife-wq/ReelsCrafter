# Admin Dashboard

Internal worker admin dashboard for ReelsCrafter.

## Overview
This dashboard provides real-time monitoring and management of the ReelsCrafter worker fleet.

## Features (Planned)
- Worker health monitoring
- Pipeline job queue visualization
- Resource utilization dashboards (CPU, GPU, Memory)
- Log streaming per worker
- Manual job retry / cancel controls
- Checkpoint inspection

## Tech Stack
- Framework: Next.js 15 (or standalone React)
- Charts: Recharts / Tremor
- Real-time: WebSocket → FastAPI `/ws/admin`
- Auth: JWT (internal-only, no public access)

## Development
```bash
cd apps/admin
npm install
npm run dev   # Starts on port 3001
```

> **Note**: This is an internal-only dashboard. Do NOT expose port 3001 publicly.
