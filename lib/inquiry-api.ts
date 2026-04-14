import { getApiBaseUrl } from './content-api'

export interface InquiryInput {
  name: string
  email: string
  phone: string
  property?: string
  propertyId?: string
  message: string
  source?: string
}

export interface InquiryRecord extends InquiryInput {
  _id?: string
  id: string
  status: 'new' | 'contacted' | 'archived'
  createdAt?: string
  updatedAt?: string
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

function buildUrl(path: string): string {
  return `${getApiBaseUrl()}${path}`
}

export async function submitInquiry(inquiry: InquiryInput): Promise<InquiryRecord> {
  const response = await fetch(buildUrl('/api/inquiries'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inquiry),
  })

  const payload = await parseResponse<{ success: boolean; inquiry: InquiryRecord }>(response)
  return payload.inquiry
}

export async function fetchInquiries(token: string): Promise<InquiryRecord[]> {
  const response = await fetch(buildUrl('/api/inquiries'), {
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const payload = await parseResponse<{ success: boolean; inquiries: InquiryRecord[] }>(response)
  return payload.inquiries
}

export async function updateInquiryStatus(id: string, status: InquiryRecord['status'], token: string): Promise<InquiryRecord> {
  const response = await fetch(buildUrl(`/api/inquiries/${id}`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  const payload = await parseResponse<{ success: boolean; inquiry: InquiryRecord }>(response)
  return payload.inquiry
}