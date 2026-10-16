const BASE_URL = import.meta.env.VITE_API_URL.replace(/\/+$/, '')

type QueryValue = string | number | undefined

export interface RequestOptions {
  query?: Record<string, QueryValue>
  body?: unknown
  /** Додати заголовок Authorization: Bearer <token> */
  auth?: boolean
}

export interface AuthHandlers {
  getAccessToken: () => string | null
  /** Оновлює access-токен; повертає false, якщо оновити не вдалося */
  refresh: () => Promise<boolean>
  onUnauthorized: () => void
}

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

let authHandlers: AuthHandlers | null = null
let refreshPromise: Promise<boolean> | null = null

export function setAuthHandlers(handlers: AuthHandlers): void {
  authHandlers = handlers
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })
  return url.toString()
}

// Кілька паралельних запитів з 401 мають чекати на один і той самий refresh
function refreshOnce(handlers: AuthHandlers): Promise<boolean> {
  refreshPromise ??= handlers.refresh().finally(() => {
    refreshPromise = null
  })
  return refreshPromise
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = options.auth ? authHandlers?.getAccessToken() : null
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    })
  } catch {
    throw new HttpError(0, 'Не вдалося з’єднатися з сервером')
  }

  if (response.status === 401 && options.auth && authHandlers) {
    if (!isRetry && (await refreshOnce(authHandlers))) {
      return request<T>(method, path, options, true)
    }
    authHandlers.onUnauthorized()
  }

  if (!response.ok) {
    let message = response.statusText || `HTTP ${response.status}`
    try {
      const data = (await response.json()) as { message?: string }
      message = data.message ?? message
    } catch {
      // тіло відповіді не JSON — лишаємо statusText
    }
    throw new HttpError(response.status, message)
  }

  return (await response.json()) as T
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}

export type HttpClient = typeof httpClient

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    return error.status === 404 ? 'Запис не знайдено' : error.message
  }
  return error instanceof Error ? error.message : 'Невідома помилка'
}
