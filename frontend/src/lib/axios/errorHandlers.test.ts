import { vi } from 'vitest'
import { AxiosError } from 'axios'
import {
  setGlobalErrorHandler,
  extractErrorMessage,
  createResponseInterceptor,
  createRequestInterceptor,
} from './errorHandlers'

describe('errorHandlers', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('setGlobalErrorHandler', () => {
    it('should set global error handler', () => {
      const handler = vi.fn()
      setGlobalErrorHandler(handler)
      expect(handler).toBeDefined()
    })
  })

  describe('extractErrorMessage', () => {
    it.each([
      [
        { response: { status: 400, data: { message: 'Custom error message' } } },
        'Custom error message',
      ],
      [{ response: { status: 401, data: { error: 'Custom error field' } } }, 'Custom error field'],
      [{ response: { status: 400, data: {} } }, 'Invalid request. Please check your input.'],
      [{ response: { status: 401, data: {} } }, 'Unauthorized access.'],
      [{ response: { status: 403, data: {} } }, 'Access forbidden.'],
      [{ response: { status: 404, data: {} } }, 'Resource not found.'],
      [{ response: { status: 500, data: {} } }, 'Server error. Please try again later.'],
      [{ response: { status: 418, data: {} } }, 'Request failed with status 418'],
      [{ request: {} }, 'Network error. Please check your connection.'],
      [{ message: 'Request setup error' }, 'Request setup error'],
      [{}, 'Request failed'],
    ])('should extract correct error message from %o', (error, expectedMessage) => {
      const result = extractErrorMessage(error as AxiosError)
      expect(result).toBe(expectedMessage)
    })

    it('should handle error with both message and error fields, preferring message', () => {
      const error = {
        response: {
          status: 400,
          data: { message: 'Priority message', error: 'Secondary error' },
        },
      } as AxiosError

      expect(extractErrorMessage(error)).toBe('Priority message')
    })

    it('should handle non-object response data', () => {
      const error = {
        response: {
          status: 500,
          data: 'string response',
        },
      } as AxiosError

      expect(extractErrorMessage(error)).toBe('Server error. Please try again later.')
    })

    it('should handle null response data', () => {
      const error = {
        response: {
          status: 404,
          data: null,
        },
      } as AxiosError

      expect(extractErrorMessage(error)).toBe('Resource not found.')
    })
  })

  describe('createResponseInterceptor', () => {
    it('should return interceptor with success and error handlers', () => {
      const interceptor = createResponseInterceptor()

      expect(interceptor.onSuccess).toBeInstanceOf(Function)
      expect(interceptor.onError).toBeInstanceOf(Function)
    })

    it('should pass through successful responses', () => {
      const interceptor = createResponseInterceptor()
      const response = {
        data: 'test',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      }

      const result = interceptor.onSuccess(response)
      expect(result).toBe(response)
    })

    it('should handle errors and call global error handler', async () => {
      const globalHandler = vi.fn()
      setGlobalErrorHandler(globalHandler)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const interceptor = createResponseInterceptor()
      const error = {
        response: { status: 400, data: {} },
        config: { url: '/test' },
      } as AxiosError

      await expect(interceptor.onError(error)).rejects.toBe(error)

      expect(globalHandler).toHaveBeenCalledWith('Invalid request. Please check your input.')
      expect(consoleSpy).toHaveBeenCalledWith('API Error:', {
        message: 'Invalid request. Please check your input.',
        status: 400,
        data: {},
        url: '/test',
      })

      consoleSpy.mockRestore()
    })

    it('should not call global error handler when not set', async () => {
      setGlobalErrorHandler(null as unknown as (message: string) => void)
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const interceptor = createResponseInterceptor()
      const error = {
        response: { status: 500, data: {} },
      } as AxiosError

      await expect(interceptor.onError(error)).rejects.toBe(error)

      expect(consoleSpy).toHaveBeenCalledWith(
        'API Error:',
        expect.objectContaining({
          message: 'Server error. Please try again later.',
        })
      )

      consoleSpy.mockRestore()
    })
  })

  describe('createRequestInterceptor', () => {
    it('should return interceptor with success and error handlers', () => {
      const interceptor = createRequestInterceptor()

      expect(interceptor.onSuccess).toBeInstanceOf(Function)
      expect(interceptor.onError).toBeInstanceOf(Function)
    })

    it('should pass through request config', () => {
      const interceptor = createRequestInterceptor()
      const config = { url: '/test', method: 'GET' } as any

      const result = interceptor.onSuccess(config)
      expect(result).toBe(config)
    })

    it('should handle request errors', async () => {
      const interceptor = createRequestInterceptor()
      const error = new Error('Request error')

      await expect(interceptor.onError(error)).rejects.toBe(error)
    })
  })
})
