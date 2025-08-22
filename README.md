# Scrabble Points Calculator

A full-stack web application for calculating Scrabble letter scores with real-time scoring, persistent storage, and leaderboard functionality.

**Tech Stack**: See [docs/architecture/technology-stack.md](docs/architecture/technology-stack.md)

## Quick Start

```bash
# 1. Initialize project (install dependencies & pull Docker images)
./init.sh

# 2. Run E2E tests with UI (automatically starts all services)
cd e2e && npm run test:ui
```

**Headless E2E** (for CI/automation):
```bash
cd e2e && npm test
```

**Manual Setup** (if you prefer to run services individually):

```bash
# 1. Start database
podman compose up -d postgres

# 2. Start backend
cd backend && ./gradlew bootRun

# 3. Start frontend
cd frontend && npm run dev
```

**Access**: http://localhost:3000

**Documentation**: See [docs/](docs/) for detailed setup, API reference, and architecture
