const Property = require('../models/Property')
const defaultProperties = require('../config/defaultProperties')

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function normalizeMedia(media = []) {
  return media
    .map((item) => ({
      type: item?.type === 'video' ? 'video' : 'image',
      url: normalizeText(item?.url),
      label: normalizeText(item?.label),
    }))
    .filter((item) => item.url)
}

function buildPropertyPayload(body = {}, previousImage = '') {
  const media = normalizeMedia(Array.isArray(body.media) ? body.media : [])
  const images = Array.isArray(body.images) ? body.images.map(normalizeText).filter(Boolean) : []
  const videos = Array.isArray(body.videos) ? body.videos.map(normalizeText).filter(Boolean) : []
  const derivedImage = body.image ? normalizeText(body.image) : media.find((item) => item.type === 'image')?.url || images[0] || previousImage
  const legacyId = normalizeText(body.legacyId)

  return {
    title: normalizeText(body.title),
    location: normalizeText(body.location),
    price: Number(body.price) || 0,
    bedrooms: Number(body.bedrooms) || 0,
    bathrooms: Number(body.bathrooms) || 0,
    area: Number(body.area) || 0,
    yearBuilt: body.yearBuilt === '' || body.yearBuilt === null || body.yearBuilt === undefined ? null : Number(body.yearBuilt),
    featured: Boolean(body.featured),
    description: normalizeText(body.description),
    ...(legacyId ? { legacyId } : {}),
    amenities: Array.isArray(body.amenities)
      ? body.amenities.map(normalizeText).filter(Boolean)
      : [],
    media,
    image: derivedImage,
    images: images.length ? images : media.filter((item) => item.type === 'image').map((item) => item.url),
    videos: videos.length ? videos : media.filter((item) => item.type === 'video').map((item) => item.url),
  }
}

function serializeProperty(property) {
  if (!property) {
    return null
  }

  const doc = typeof property.toObject === 'function' ? property.toObject() : property
  const media = normalizeMedia(doc.media || [])

  return {
    ...doc,
    id: doc.legacyId || doc._id?.toString() || doc.id,
    legacyId: doc.legacyId,
    image: doc.image || media.find((item) => item.type === 'image')?.url || media[0]?.url || '',
    media,
    images: Array.isArray(doc.images) ? doc.images : media.filter((item) => item.type === 'image').map((item) => item.url),
    videos: Array.isArray(doc.videos) ? doc.videos : media.filter((item) => item.type === 'video').map((item) => item.url),
  }
}

function buildLookupQuery(identifier) {
  const query = [{ legacyId: identifier }]

  if (/^[a-fA-F0-9]{24}$/.test(identifier)) {
    query.push({ _id: identifier })
  }

  return { $or: query }
}

async function ensureDefaultProperties() {
  const existingCount = await Property.countDocuments()

  if (existingCount > 0) {
    return Property.find().sort({ createdAt: -1 })
  }

  await Property.insertMany(defaultProperties.map((property) => buildPropertyPayload(property)))
  return Property.find().sort({ createdAt: -1 })
}

async function getProperties(req, res, next) {
  try {
    const properties = await ensureDefaultProperties()
    res.status(200).json(properties.map(serializeProperty))
  } catch (error) {
    next(error)
  }
}

async function getPropertyById(req, res, next) {
  try {
    const property = await Property.findOne(buildLookupQuery(req.params.id))

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.status(200).json(serializeProperty(property))
  } catch (error) {
    next(error)
  }
}

async function createProperty(req, res, next) {
  try {
    const payload = buildPropertyPayload(req.body)

    if (!payload.title || !payload.location || !payload.description || !payload.image) {
      return res.status(400).json({ message: 'Title, location, description, and at least one image are required' })
    }

    const created = await Property.create(payload)
    res.status(201).json({ success: true, property: serializeProperty(created) })
  } catch (error) {
    next(error)
  }
}

async function updateProperty(req, res, next) {
  try {
    const existing = await Property.findOne(buildLookupQuery(req.params.id))

    if (!existing) {
      return res.status(404).json({ message: 'Property not found' })
    }

    const payload = buildPropertyPayload(req.body, existing.image)
    const updated = await Property.findByIdAndUpdate(existing._id, payload, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({ success: true, property: serializeProperty(updated) })
  } catch (error) {
    next(error)
  }
}

async function deleteProperty(req, res, next) {
  try {
    const deleted = await Property.findOneAndDelete(buildLookupQuery(req.params.id))

    if (!deleted) {
      return res.status(404).json({ message: 'Property not found' })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  ensureDefaultProperties,
  serializeProperty,
}