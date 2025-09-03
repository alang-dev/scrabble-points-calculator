import { vi } from 'vitest'

// Global API mock configuration
const mockApiPost = vi.fn()
const mockApiGet = vi.fn()
const mockApiPut = vi.fn()
const mockApiDelete = vi.fn()
const mockSetGlobalErrorHandler = vi.fn()

// Create a mock API object
export const mockApi = {
  get: mockApiGet,
  post: mockApiPost,
  put: mockApiPut,
  delete: mockApiDelete,
}

// Global mock setup for the API module
vi.mock('../lib/api', () => ({
  default: mockApi,
  setGlobalErrorHandler: mockSetGlobalErrorHandler,
}))

// Export individual mock functions for easy access in tests
export { mockApiDelete, mockApiGet, mockApiPost, mockApiPut, mockSetGlobalErrorHandler }

// Helper function to reset all API mocks
export const resetApiMocks = () => {
  mockApiGet.mockReset()
  mockApiPost.mockReset()
  mockApiPut.mockReset()
  mockApiDelete.mockReset()
  mockSetGlobalErrorHandler.mockReset()
}

// Helper function to set up common API responses
export const setupApiMocks = {
  // Common mock for successful score save
  scoreSave: (letters: string = 'HELLO', points: number = 10) => {
    mockApiPost.mockResolvedValue({
      data: { letters, points },
    })
  },

  // Common mock for scoring rules fetch
  scoringRules: (rules: any[] = []) => {
    mockApiGet.mockResolvedValue({
      data: {
        pattern: 'test-pattern',
        rules:
          rules.length > 0
            ? rules
            : [
                { letters: 'A', points: 1 },
                { letters: 'E', points: 1 },
                { letters: 'I', points: 1 },
              ],
      },
    })
  },

  // Common mock for top scores fetch
  topScores: (scores: any[] = []) => {
    mockApiGet.mockResolvedValue({
      data: {
        scores:
          scores.length > 0
            ? scores
            : [
                { id: 1, letters: 'HELLO', points: 10, createdAt: '2023-01-01' },
                { id: 2, letters: 'WORLD', points: 15, createdAt: '2023-01-02' },
              ],
      },
    })
  },

  // Common mock for score computation
  scoreCompute: (letters: string = 'HELLO', score: number = 10) => {
    mockApiPost.mockResolvedValue({
      data: { letters, score },
    })
  },
}
