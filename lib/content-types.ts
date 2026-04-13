export interface Amenity {
  title: string
  description: string
}

export interface ConstructionUpdate {
  label: string
  value: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface ContentData {
  _id?: string
  hero: {
    title: string
    subtitle: string
  }
  overview: string
  connectivity: string
  amenities: Amenity[]
  about: string
  constructionUpdates: ConstructionUpdate[]
  faqs: FAQ[]
  createdAt?: string
  updatedAt?: string
}

export const emptyContent: ContentData = {
  hero: {
    title: '',
    subtitle: '',
  },
  overview: '',
  connectivity: '',
  amenities: [{ title: '', description: '' }],
  about: '',
  constructionUpdates: [{ label: '', value: '' }],
  faqs: [{ question: '', answer: '' }],
}
