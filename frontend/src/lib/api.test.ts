import { vi } from 'vitest'
import { setGlobalErrorHandler } from './api'

// Mock axios to avoid HTTP calls
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}))

// Mock the api functions
vi.mock('./api/index', () => ({
  serializeParams: vi.fn(),
  setGlobalErrorHandler: vi.fn(),
  createResponseInterceptor: vi.fn(() => ({
    onSuccess: vi.fn(response => response),
    onError: vi.fn(),
  })),
  createRequestInterceptor: vi.fn(() => ({
    onSuccess: vi.fn(config => config),
    onError: vi.fn(),
  })),
}))

describe('api configuration', () => {
  it('should export setGlobalErrorHandler', () => {
    expect(setGlobalErrorHandler).toBeDefined()
  })

  it('should create axios instance and setup interceptors', async () => {
    // Import to trigger axios setup
    await import('./api')

    const axios = await import('axios')
    expect(axios.default.create).toHaveBeenCalledWith({
      baseURL: '/api/v1',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: expect.any(Function),
    })
  })
})
