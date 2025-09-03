import { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

let globalErrorHandler: ((message: string) => void) | null = null

export const setGlobalErrorHandler = (handler: (message: string) => void) => {
  globalErrorHandler = handler
}

export const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    const status = error.response.status
    const data = error.response.data as { message?: string; error?: string } | unknown

    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message
    }
    if (data && typeof data === 'object' && 'error' in data && typeof data.error === 'string') {
      return data.error
    }

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
    return 'Network error. Please check your connection.'
  }

  return error.message || 'Request failed'
}

export const createResponseInterceptor = () => ({
  onSuccess: (response: AxiosResponse) => response,
  onError: (error: AxiosError) => {
    const errorMessage = extractErrorMessage(error)

    if (globalErrorHandler) {
      globalErrorHandler(errorMessage)
    }

    console.error('API Error:', {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    })

    return Promise.reject(error)
  },
})

export const createRequestInterceptor = () => ({
  onSuccess: (config: InternalAxiosRequestConfig) => config,
  onError: (error: unknown) => {
    const errorInstance = error instanceof Error ? error : new Error(String(error))
    return Promise.reject(errorInstance)
  },
})
