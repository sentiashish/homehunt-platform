import { getApiBaseUrl } from './content-api'

export type PropertyMediaType = 'image' | 'video'

export interface PropertyMedia {
  type: PropertyMediaType
  url: string
  label?: string
}

export interface PropertyRecord {
  _id?: string
  id: string
  title: string
  location: string
  price: number
  image: string
  bedrooms: number
  bathrooms: number
  area: number
  featured?: boolean
  description?: string
  amenities?: string[]
  media?: PropertyMedia[]
  images?: string[]
  videos?: string[]
  yearBuilt?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface PropertyInput {
  title: string
  location: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  yearBuilt?: number | null
  featured: boolean
  description: string
  amenities: string[]
  media: PropertyMedia[]
  image: string
  images: string[]
  videos: string[]
}

export const emptyPropertyInput: PropertyInput = {
  title: '',
  location: '',
  price: 0,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
  yearBuilt: null,
  featured: false,
  description: '',
  amenities: [],
  media: [{ type: 'image', url: '' }],
  image: '',
  images: [],
  videos: [],
}

const API_BASE_URL = getApiBaseUrl()

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

function normalizeProperty(property: Partial<PropertyRecord> & { _id?: string }): PropertyRecord {
  const media = Array.isArray(property.media) ? property.media : []
  const image = property.image || media.find((item) => item.type === 'image')?.url || media[0]?.url || ''

  return {
    id: property.id || property._id || '',
    title: property.title || '',
    location: property.location || '',
    price: property.price || 0,
    image,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area || 0,
    featured: Boolean(property.featured),
    description: property.description || '',
    amenities: property.amenities || [],
    media,
    images: property.images || media.filter((item) => item.type === 'image').map((item) => item.url),
    videos: property.videos || media.filter((item) => item.type === 'video').map((item) => item.url),
    yearBuilt: property.yearBuilt ?? null,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
  }
}

export async function fetchProperties(): Promise<PropertyRecord[]> {
  const response = await fetch(buildUrl('/api/properties'), {
    cache: 'no-store',
  })

  const payload = await parseResponse<PropertyRecord[]>(response)
  return payload.map(normalizeProperty)
}

export async function fetchPropertyById(id: string): Promise<PropertyRecord> {
  const response = await fetch(buildUrl(`/api/properties/${id}`), {
    cache: 'no-store',
  })

  const payload = await parseResponse<PropertyRecord>(response)
  return normalizeProperty(payload)
}

export async function createProperty(property: PropertyInput, token: string): Promise<PropertyRecord> {
  const response = await fetch(buildUrl('/api/properties'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(property),
  })

  const payload = await parseResponse<{ success: boolean; property: PropertyRecord }>(response)
  return normalizeProperty(payload.property)
}

export async function updateProperty(id: string, property: PropertyInput, token: string): Promise<PropertyRecord> {
  const response = await fetch(buildUrl(`/api/properties/${id}`), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(property),
  })

  const payload = await parseResponse<{ success: boolean; property: PropertyRecord }>(response)
  return normalizeProperty(payload.property)
}

export async function deleteProperty(id: string, token: string): Promise<void> {
  const response = await fetch(buildUrl(`/api/properties/${id}`), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  await parseResponse<{ success: boolean }>(response)
}