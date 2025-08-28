import { FullConfig } from '@playwright/test'

async function globalSetup(_config: FullConfig) {
  // Set backend API base URL as environment variable for tests
  process.env.API_BASE_URL = `http://localhost:${process.env.BACKEND_PORT || '8080'}/api/v1`
}

export default globalSetup
