const Inquiry = require('../models/Inquiry')

function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function serializeInquiry(inquiry) {
  if (!inquiry) {
    return null
  }

  const doc = typeof inquiry.toObject === 'function' ? inquiry.toObject() : inquiry

  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
  }
}

async function createInquiry(req, res, next) {
  try {
    const body = req.body || {}
    const name = normalizeText(body.name)
    const email = normalizeText(body.email).toLowerCase()
    const phone = normalizeText(body.phone)
    const message = normalizeText(body.message)
    const property = normalizeText(body.property) || 'General Enquiry'
    const propertyId = normalizeText(body.propertyId)

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Name, email, phone, and message are required' })
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      phone,
      property,
      propertyId,
      message,
      source: normalizeText(body.source) || 'website',
      status: 'new',
    })

    return res.status(201).json({ success: true, inquiry: serializeInquiry(inquiry) })
  } catch (error) {
    next(error)
  }
}

async function getInquiries(req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, inquiries: inquiries.map(serializeInquiry) })
  } catch (error) {
    next(error)
  }
}

async function updateInquiry(req, res, next) {
  try {
    const { status } = req.body || {}
    const inquiry = await Inquiry.findById(req.params.id)

    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }

    if (status && ['new', 'contacted', 'archived'].includes(status)) {
      inquiry.status = status
    }

    await inquiry.save()

    return res.status(200).json({ success: true, inquiry: serializeInquiry(inquiry) })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createInquiry,
  getInquiries,
  updateInquiry,
  serializeInquiry,
}