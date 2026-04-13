'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Save, Trash2 } from 'lucide-react'
import { fetchContent, updateContent } from '@/lib/content-api'
import { ContentData, emptyContent } from '@/lib/content-types'

export default function AdminDashboardEditorPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [form, setForm] = useState<ContentData>(emptyContent)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken')

    if (!storedToken) {
      router.push('/admin/login')
      return
    }

    setToken(storedToken)

    async function load() {
      try {
        const payload = await fetchContent()
        setForm({
          hero: payload.hero,
          overview: payload.overview,
          connectivity: payload.connectivity,
          amenities: payload.amenities?.length ? payload.amenities : [{ title: '', description: '' }],
          about: payload.about,
          constructionUpdates: payload.constructionUpdates?.length
            ? payload.constructionUpdates
            : [{ label: '', value: '' }],
          faqs: payload.faqs?.length ? payload.faqs : [{ question: '', answer: '' }],
        })
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Could not load content')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [router])

  const canSave = useMemo(() => {
    const heroValid = form.hero.title.trim().length > 0 && form.hero.subtitle.trim().length > 0
    const textValid = form.overview.trim().length > 0 && form.connectivity.trim().length > 0 && form.about.trim().length > 0

    return heroValid && textValid
  }, [form])

  const updateAmenity = (index: number, key: 'title' | 'description', value: string) => {
    const updated = [...form.amenities]
    updated[index] = { ...updated[index], [key]: value }
    setForm({ ...form, amenities: updated })
  }

  const updateConstruction = (index: number, key: 'label' | 'value', value: string) => {
    const updated = [...form.constructionUpdates]
    updated[index] = { ...updated[index], [key]: value }
    setForm({ ...form, constructionUpdates: updated })
  }

  const updateFaq = (index: number, key: 'question' | 'answer', value: string) => {
    const updated = [...form.faqs]
    updated[index] = { ...updated[index], [key]: value }
    setForm({ ...form, faqs: updated })
  }

  async function handleSave() {
    if (!token) {
      router.push('/admin/login')
      return
    }

    setIsSaving(true)
    setMessage('')
    setError('')

    try {
      const cleanedPayload: ContentData = {
        ...form,
        amenities: form.amenities.filter((item) => item.title.trim() && item.description.trim()),
        constructionUpdates: form.constructionUpdates.filter((item) => item.label.trim() && item.value.trim()),
        faqs: form.faqs.filter((item) => item.question.trim() && item.answer.trim()),
      }

      const updated = await updateContent(cleanedPayload, token)
      setForm({
        hero: updated.hero,
        overview: updated.overview,
        connectivity: updated.connectivity,
        amenities: updated.amenities,
        about: updated.about,
        constructionUpdates: updated.constructionUpdates,
        faqs: updated.faqs,
      })
      setMessage('Content updated successfully.')
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to update content')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading dashboard...</div>
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Content Dashboard</h1>
          <p className="text-muted-foreground">Edit all dynamic website content from one place.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!canSave || isSaving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-accent-foreground font-semibold disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-700">{message}</div>}
      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">{error}</div>}

      <motion.section className="rounded-xl border border-border bg-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-semibold mb-4">Hero</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            value={form.hero.title}
            onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
            placeholder="Hero title"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
          />
          <textarea
            value={form.hero.subtitle}
            onChange={(e) => setForm({ ...form, hero: { ...form.hero, subtitle: e.target.value } })}
            placeholder="Hero subtitle"
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
          />
        </div>
      </motion.section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Overview & Connectivity</h2>
        <textarea
          value={form.overview}
          onChange={(e) => setForm({ ...form, overview: e.target.value })}
          placeholder="Project overview"
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
        <textarea
          value={form.connectivity}
          onChange={(e) => setForm({ ...form, connectivity: e.target.value })}
          placeholder="Connectivity content"
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Amenities</h2>
          <button
            onClick={() => setForm({ ...form, amenities: [...form.amenities, { title: '', description: '' }] })}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {form.amenities.map((item, index) => (
          <div key={`amenity-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-border rounded-lg p-3">
            <input
              value={item.title}
              onChange={(e) => updateAmenity(index, 'title', e.target.value)}
              placeholder="Amenity title"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
            />
            <div className="flex gap-2">
              <input
                value={item.description}
                onChange={(e) => updateAmenity(index, 'description', e.target.value)}
                placeholder="Amenity description"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
              />
              <button
                onClick={() => setForm({ ...form, amenities: form.amenities.filter((_, i) => i !== index) })}
                className="rounded-lg border border-border px-3"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <textarea
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
          placeholder="About content"
          rows={5}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Construction Updates</h2>
          <button
            onClick={() =>
              setForm({
                ...form,
                constructionUpdates: [...form.constructionUpdates, { label: '', value: '' }],
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {form.constructionUpdates.map((item, index) => (
          <div key={`update-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-border rounded-lg p-3">
            <input
              value={item.label}
              onChange={(e) => updateConstruction(index, 'label', e.target.value)}
              placeholder="Label"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
            />
            <div className="flex gap-2">
              <input
                value={item.value}
                onChange={(e) => updateConstruction(index, 'value', e.target.value)}
                placeholder="Value"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
              />
              <button
                onClick={() =>
                  setForm({
                    ...form,
                    constructionUpdates: form.constructionUpdates.filter((_, i) => i !== index),
                  })
                }
                className="rounded-lg border border-border px-3"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">FAQs</h2>
          <button
            onClick={() => setForm({ ...form, faqs: [...form.faqs, { question: '', answer: '' }] })}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {form.faqs.map((item, index) => (
          <div key={`faq-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-border rounded-lg p-3">
            <input
              value={item.question}
              onChange={(e) => updateFaq(index, 'question', e.target.value)}
              placeholder="Question"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
            />
            <div className="flex gap-2">
              <input
                value={item.answer}
                onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                placeholder="Answer"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
              />
              <button
                onClick={() => setForm({ ...form, faqs: form.faqs.filter((_, i) => i !== index) })}
                className="rounded-lg border border-border px-3"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
