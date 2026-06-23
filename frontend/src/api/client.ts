import axios from 'axios'
import { getClientId } from '@/lib/clientId'
import type { ApiErrorBody } from './types'

// In dev this is "" and Vite proxies /api -> :8080. In prod set VITE_API_BASE_URL to the Render URL.
const baseURL = import.meta.env.VITE_API_BASE_URL ?? ''

export const api = axios.create({ baseURL, timeout: 15000 })

// Attach the anonymous client id to every request (used by the watchlist).
api.interceptors.request.use((config) => {
  config.headers.set('X-Client-Id', getClientId())
  return config
})

function errorBody(err: unknown): ApiErrorBody | undefined {
  if (axios.isAxiosError(err)) {
    return err.response?.data as ApiErrorBody | undefined
  }
  return undefined
}

/** A human-readable message for any thrown request error. */
export function apiErrorMessage(err: unknown): string {
  const body = errorBody(err)
  if (body?.message) return body.message
  if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
    return 'The request timed out. The server may be waking up.'
  }
  return 'Something went wrong. Please try again.'
}

/** Whether the backend marked this error as retryable (rate limit / transient upstream). */
export function isRetryable(err: unknown): boolean {
  return errorBody(err)?.retryable ?? false
}
