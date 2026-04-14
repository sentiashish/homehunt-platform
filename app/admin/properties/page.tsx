'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Image as ImageIcon, Play, X, Save } from 'lucide-react'
import { formatINRCompact } from '@/lib/currency'
import { properties as fallbackProperties } from '@/lib/properties'
import {
  createProperty,
  deleteProperty,
  emptyPropertyInput,
  fetchProperties,
  PropertyInput,
  PropertyMedia,
  PropertyRecord,
  updateProperty,
} from '@/lib/property-api'

function createEmptyForm(): PropertyInput {
  return {
    ...emptyPropertyInput,
    media: [{ type: 'image', url: '' }],
    images: [],
    videos: [],
  }
}

function prepareForm(property: PropertyRecord): PropertyInput {
  const media = property.media?.length
    ? property.media.map((item) => ({ type: item.type, url: item.url, label: item.label }))
    : [{ type: 'image', url: property.image }]

  return {
    title: property.title,
    location: property.location,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    yearBuilt: property.yearBuilt ?? null,
    featured: Boolean(property.featured),
    description: property.description || '',
    amenities: property.amenities || [],
    media,
    image: property.image,
    images: property.images || [],
    videos: property.videos || [],
  }
}

function normalizeMedia(media: PropertyMedia[]) {
  return media
    .map((item) => ({
      type: item.type === 'video' ? ('video' as const) : ('image' as const),
      url: item.url.trim(),
      label: item.label?.trim() || '',
    }))
    .filter((item) => item.url)
}

function createThumbnail(property: PropertyRecord) {
  const video = property.media?.find((item) => item.type === 'video')
  if (video) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-black">
        <video className="h-full w-full object-cover" controls muted playsInline>
          <source src={video.url} />
        </video>
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          <Play className="h-3 w-3" />
          Video
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-muted">
      <img src={property.image} alt={property.title} className="h-full w-full object-cover" />
      <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-foreground backdrop-blur-sm">
        <ImageIcon className="h-3 w-3" />
        Image
      </div>
    </div>
  )
}

export default function AdminPropertiesPage() {
  const [token, setToken] = useState('')
  const [properties, setProperties] = useState<PropertyRecord[]>(fallbackProperties)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<PropertyInput>(createEmptyForm())
  const [amenitiesText, setAmenitiesText] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')

    if (!storedToken) {
      window.location.href = '/admin/login'
      return
    }

    setToken(storedToken)

    async function loadProperties() {
      try {
        const payload = await fetchProperties()
        setProperties(payload)
        setError('')
      } catch (loadError) {
        setProperties(fallbackProperties)
        setError(loadError instanceof Error ? loadError.message : 'Could not load properties')
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [])

  const propertySummary = useMemo(() => {
    const imageCount = properties.filter((property) => property.media?.some((item) => item.type === 'image')).length
    const videoCount = properties.filter((property) => property.media?.some((item) => item.type === 'video')).length
    return { imageCount, videoCount }
  }, [properties])

  const openCreateModal = () => {
    setEditingId(null)
    setForm(createEmptyForm())
    setAmenitiesText('')
    setMessage('')
    setError('')
    setIsModalOpen(true)
  }

  const openEditModal = (property: PropertyRecord) => {
    setEditingId(property.id)
    setForm(prepareForm(property))
    setAmenitiesText((property.amenities || []).join(', '))
    setMessage('')
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingId(null)
    setForm(createEmptyForm())
    setAmenitiesText('')
  }

  const updateMedia = (index: number, key: 'type' | 'url' | 'label', value: string) => {
    setForm((current) => {
      const media = [...current.media]
      const currentItem = media[index] || { type: 'image', url: '' }
      media[index] = {
        ...currentItem,
        [key]: value,
      }
      return { ...current, media }
    })
  }

  const addMedia = (type: PropertyMedia['type']) => {
    setForm((current) => ({ ...current, media: [...current.media, { type, url: '', label: '' }] }))
  }

  const removeMedia = (index: number) => {
    setForm((current) => ({
      ...current,
      media: current.media.length > 1 ? current.media.filter((_, itemIndex) => itemIndex !== index) : [{ type: 'image', url: '' }],
    }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      window.location.href = '/admin/login'
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const normalizedMedia = normalizeMedia(form.media)
      const normalizedAmenities = amenitiesText
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      const payload: PropertyInput = {
        ...form,
        title: form.title.trim(),
        location: form.location.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        area: Number(form.area) || 0,
        yearBuilt: form.yearBuilt === null || form.yearBuilt === undefined || form.yearBuilt === 0 ? null : Number(form.yearBuilt),
        featured: Boolean(form.featured),
        amenities: normalizedAmenities,
        media: normalizedMedia,
        image: form.image.trim() || normalizedMedia.find((item) => item.type === 'image')?.url || '',
        images: normalizedMedia.filter((item) => item.type === 'image').map((item) => item.url),
        videos: normalizedMedia.filter((item) => item.type === 'video').map((item) => item.url),
      }

      if (!payload.title || !payload.location || !payload.description || !payload.image) {
        throw new Error('Title, location, description, and at least one image are required.')
      }

      const saved = editingId
        ? await updateProperty(editingId, payload, token)
        : await createProperty(payload, token)

      setProperties((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? saved : item))
        }

        return [saved, ...current]
      })

      setMessage(editingId ? 'Property updated successfully.' : 'Property created successfully.')
      closeModal()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to save property')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (propertyId: string) => {
    if (!token) {
      window.location.href = '/admin/login'
      return
    }

    const shouldDelete = window.confirm('Delete this property permanently?')
    if (!shouldDelete) {
      return
    }

    try {
      await deleteProperty(propertyId, token)
      setProperties((current) => current.filter((property) => property.id !== propertyId))
      setMessage('Property deleted successfully.')
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete property')
    }
  }

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading properties...</div>
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage live listings, media, and publishing status.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Listings</div>
            <div className="mt-1 text-lg font-semibold">{properties.length}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Images</div>
            <div className="mt-1 text-lg font-semibold">{propertySummary.imageCount}</div>
          </div>
          <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Videos</div>
            <div className="mt-1 text-lg font-semibold">{propertySummary.videoCount}</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Property
          </motion.button>
        </div>
      </div>

      {message && <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700">{message}</div>}
      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {properties.map((property) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            {createThumbnail(property)}

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{property.title}</h2>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${property.featured ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'}`}>
                    {property.featured ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{property.location}</p>
                <p className="mt-2 text-lg font-semibold text-accent">{formatINRCompact(property.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => openEditModal(property)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleDelete(property.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </motion.button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <div className="rounded-xl border border-border bg-background px-3 py-2">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Beds</div>
                <div className="mt-1 font-semibold">{property.bedrooms}</div>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Baths</div>
                <div className="mt-1 font-semibold">{property.bathrooms}</div>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Area</div>
                <div className="mt-1 font-semibold">{property.area.toLocaleString()} sqft</div>
              </div>
              <div className="rounded-xl border border-border bg-background px-3 py-2">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Media</div>
                <div className="mt-1 font-semibold">{property.media?.length || 0}</div>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {property.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(property.media || []).map((item, index) => (
                <span
                  key={`${property.id}-media-${index}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${item.type === 'video' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}
                >
                  {item.type === 'video' ? <Play className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                  {item.type}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-h-[92vh] w-full overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {editingId ? 'Edit Listing' : 'New Listing'}
                  </p>
                  <h2 className="mt-1 text-2xl font-bold">
                    {editingId ? 'Update Property' : 'Create Property'}
                  </h2>
                </div>
                <button onClick={closeModal} className="rounded-lg p-2 hover:bg-muted" aria-label="Close modal">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Title</label>
                    <input
                      value={form.title}
                      onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      placeholder="Property title"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Location</label>
                    <input
                      value={form.location}
                      onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      placeholder="City, area"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Price</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(event) => setForm((current) => ({ ...current, price: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      min={0}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Beds</label>
                    <input
                      type="number"
                      value={form.bedrooms}
                      onChange={(event) => setForm((current) => ({ ...current, bedrooms: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      min={0}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Baths</label>
                    <input
                      type="number"
                      value={form.bathrooms}
                      onChange={(event) => setForm((current) => ({ ...current, bathrooms: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      min={0}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Area</label>
                    <input
                      type="number"
                      value={form.area}
                      onChange={(event) => setForm((current) => ({ ...current, area: Number(event.target.value) }))}
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      min={0}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Year Built</label>
                    <input
                      type="number"
                      value={form.yearBuilt ?? ''}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          yearBuilt: event.target.value ? Number(event.target.value) : null,
                        }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-4 py-3"
                      placeholder="Optional"
                    />
                  </div>
                  <label className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(form.featured)}
                      onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                    />
                    Publish as featured property
                  </label>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={5}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    placeholder="Property description"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Amenities</label>
                  <textarea
                    value={amenitiesText}
                    onChange={(event) => setAmenitiesText(event.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3"
                    placeholder="Comma-separated amenities"
                  />
                </div>

                <div className="space-y-3 rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">Media</h3>
                      <p className="text-sm text-muted-foreground">Add images and videos as URL entries.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addMedia('image')}
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        Add Image
                      </button>
                      <button
                        type="button"
                        onClick={() => addMedia('video')}
                        className="rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
                      >
                        Add Video
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {form.media.map((item, index) => (
                      <div key={`media-${index}`} className="grid grid-cols-1 gap-3 rounded-xl border border-border p-3 md:grid-cols-[120px_1fr_1fr_auto]">
                        <select
                          value={item.type}
                          onChange={(event) => updateMedia(index, 'type', event.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                        <input
                          value={item.url}
                          onChange={(event) => updateMedia(index, 'url', event.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                          placeholder={`${item.type === 'video' ? 'Video' : 'Image'} URL`}
                        />
                        <input
                          value={item.label || ''}
                          onChange={(event) => updateMedia(index, 'label', event.target.value)}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                          placeholder="Label or caption"
                        />
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-2 text-sm font-semibold hover:bg-muted"
                          aria-label="Remove media"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 font-semibold hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 font-semibold text-background disabled:opacity-60"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Property'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  )
}
