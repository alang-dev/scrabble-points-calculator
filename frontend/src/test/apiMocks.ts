import { vi } from 'vitest'

const mockApiPost = vi.fn()
const mockApiGet = vi.fn()
const mockApiPut = vi.fn()
const mockApiDelete = vi.fn()
const mockSetGlobalErrorHandler = vi.fn()

export const mockApi = {
  get: mockApiGet,
  post: mockApiPost,
  put: mockApiPut,
  delete: mockApiDelete,
}

vi.mock('../lib/api', () => ({
  default: mockApi,
  setGlobalErrorHandler: mockSetGlobalErrorHandler,
}))

export { mockApiDelete, mockApiGet, mockApiPost, mockApiPut, mockSetGlobalErrorHandler }

export const resetApiMocks = () => {
  mockApiGet.mockReset()
  mockApiPost.mockReset()
  mockApiPut.mockReset()
  mockApiDelete.mockReset()
  mockSetGlobalErrorHandler.mockReset()
}
