import axios, { type AxiosInstance } from 'axios'
import {
  serializeParams,
  setGlobalErrorHandler,
  createResponseInterceptor,
  createRequestInterceptor,
} from './axios/index'

const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: serializeParams,
})

const responseInterceptor = createResponseInterceptor()
api.interceptors.response.use(responseInterceptor.onSuccess, responseInterceptor.onError)

const requestInterceptor = createRequestInterceptor()
api.interceptors.request.use(requestInterceptor.onSuccess, requestInterceptor.onError)

export { setGlobalErrorHandler }
export default api
