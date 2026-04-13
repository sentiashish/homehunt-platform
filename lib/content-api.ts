import { ContentData } from './content-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

function buildUrl(path: string): string {
  return `${API_BASE_URL}${path}`
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

export async function fetchContent(): Promise<ContentData> {
  const response = await fetch(buildUrl('/api/content'), {
    cache: 'no-store',
  })

  return parseResponse<ContentData>(response)
}

export async function loginAdmin(email: string, password: string): Promise<{ token: string }> {
  const response = await fetch(buildUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  return parseResponse<{ token: string }>(response)
}

export async function updateContent(content: ContentData, token: string): Promise<ContentData> {
  const response = await fetch(buildUrl('/api/content'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(content),
  })

  const payload = await parseResponse<{ success: boolean; content: ContentData }>(response)
  return payload.content
}

export function getApiBaseUrl(): string {
  return API_BASE_URL
}
