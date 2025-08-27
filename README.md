# Scrabble Points Calculator

## Prerequisites

Before starting, ensure you have the required development environment installed. See [docs/architecture/technology-stack.md](docs/architecture/technology-stack.md) for the complete list of required tools and versions.

**Windows Users**: The setup scripts are written in Bash. You'll need one of the following to run them:
- [WSL (Windows Subsystem for Linux)](https://docs.microsoft.com/en-us/windows/wsl/install) - Recommended
- [Git Bash](https://git-scm.com/download/win) - Comes with Git for Windows
- [MSYS2](https://www.msys2.org/) - Unix-like environment

## Quick Start

```bash
# 1. Copy and configure environment file
cp .env.example .env
# Edit .env file with your local configuration

# 2. Initialize project (install dependencies & pull Docker images)
./scripts/init.sh

# 3. Start all services (database, backend, frontend)
./start.sh
```

## Testing

**E2E tests with UI**:
```bash
cd e2e && npm run test:ui
```

**Headless E2E** (for CI/automation):
```bash
cd e2e && npm test
```

## Documentation

See [docs/](docs/) for detailed setup, API reference, and architecture documentation.
