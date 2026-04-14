export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user'
}

const USER_TOKEN_KEY = 'userToken'
const USER_PROFILE_KEY = 'userProfile'

function hasWindow() {
  return typeof window !== 'undefined'
}

function emitAuthChange() {
  if (!hasWindow()) return
  window.dispatchEvent(new Event('user-auth-changed'))
}

export function setUserSession(token: string, user: AuthUser) {
  if (!hasWindow()) return

  localStorage.setItem(USER_TOKEN_KEY, token)
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user))
  emitAuthChange()
}

export function getUserToken(): string | null {
  if (!hasWindow()) return null

  return localStorage.getItem(USER_TOKEN_KEY)
}

export function getUserProfile(): AuthUser | null {
  if (!hasWindow()) return null

  const raw = localStorage.getItem(USER_PROFILE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

export function clearUserSession() {
  if (!hasWindow()) return

  localStorage.removeItem(USER_TOKEN_KEY)
  localStorage.removeItem(USER_PROFILE_KEY)
  emitAuthChange()
}

export function isUserLoggedIn(): boolean {
  return Boolean(getUserToken())
}
