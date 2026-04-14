const SAVED_PROPERTIES_KEY = 'savedProperties'

function hasWindow() {
  return typeof window !== 'undefined'
}

function emitWishlistChange() {
  if (!hasWindow()) return
  window.dispatchEvent(new Event('wishlist-changed'))
}

export function getSavedPropertyIds(): string[] {
  if (!hasWindow()) return []

  const raw = localStorage.getItem(SAVED_PROPERTIES_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function isPropertySaved(propertyId: string): boolean {
  return getSavedPropertyIds().includes(propertyId)
}

export function saveProperty(propertyId: string): { added: boolean; count: number } {
  if (!hasWindow()) return { added: false, count: 0 }

  const saved = getSavedPropertyIds()
  if (saved.includes(propertyId)) {
    return { added: false, count: saved.length }
  }

  const next = [...saved, propertyId]
  localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(next))
  emitWishlistChange()
  return { added: true, count: next.length }
}

export function removeSavedProperty(propertyId: string): number {
  if (!hasWindow()) return 0

  const next = getSavedPropertyIds().filter((id) => id !== propertyId)
  localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(next))
  emitWishlistChange()
  return next.length
}
