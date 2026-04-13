import { getApiBaseUrl } from './content-api'
import { AuthUser } from './user-auth'

interface AuthResponse {
  success: boolean
  token: string
  user: AuthUser
}

async function parseResponse<T>(response: Response): Promise<T> {
  let payload: any = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`)
  }

  return payload as T
}

export async function signupUser(name: string, email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  return parseResponse<AuthResponse>(response)
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${getApiBaseUrl()}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return parseResponse<AuthResponse>(response)
}

export async function fetchCurrentUser(token: string): Promise<{ success: boolean; user: AuthUser }> {
  const response = await fetch(`${getApiBaseUrl()}/api/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  })

  return parseResponse<{ success: boolean; user: AuthUser }>(response)
}
