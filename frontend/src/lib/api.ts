import axios, { type AxiosError, type AxiosInstance } from 'axios'

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: params => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item))
      } else {
        searchParams.append(key, String(value))
      }
    })
    return searchParams.toString()
  },
})

// Error message handler - this will be set by the App component
let globalErrorHandler: ((message: string) => void) | null = null

// Set the global error handler
export const setGlobalErrorHandler = (handler: (message: string) => void) => {
  globalErrorHandler = handler
}

// Extract error message from axios error
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status
    const data = error.response.data as { message?: string; error?: string } | unknown

    // Try to extract error message from response
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return data.error
    }

    // Fallback based on status code
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Unauthorized access.'
      case 403:
        return 'Access forbidden.'
      case 404:
        return 'Resource not found.'
      case 500:
        return 'Server error. Please try again later.'
      default:
        return `Request failed with status ${status}`
    }
  }

  if (error.request) {
    // Network error or no response
    return 'Network error. Please check your connection.'
  }

  // Request setup error
  return error.message || 'Request failed'
}

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    const errorMessage = extractErrorMessage(error)

    // Call global error handler if available
    if (globalErrorHandler) {
      globalErrorHandler(errorMessage)
    }

    // Log error for debugging
    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    })

    return Promise.reject(error)
  }
)

// Request interceptor (for future use - authentication tokens, etc.)
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

export default api
