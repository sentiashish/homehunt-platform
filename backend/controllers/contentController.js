const Content = require('../models/Content')
const defaultContent = require('../config/defaultContent')

async function ensureDefaultContent() {
  const existing = await Content.findOne()

  if (existing) {
    return existing
  }

  const created = await Content.create(defaultContent)
  return created
}

async function getContent(req, res, next) {
  try {
    const content = await ensureDefaultContent()
    res.status(200).json(content)
  } catch (error) {
    next(error)
  }
}

async function updateContent(req, res, next) {
  try {
    const existing = await ensureDefaultContent()

    const updated = await Content.findByIdAndUpdate(existing._id, req.body, {
      new: true,
      runValidators: true,
      overwrite: false,
    })

    res.status(200).json({ success: true, content: updated })
  } catch (error) {
    next(error)
  }
}

module.exports = { getContent, updateContent, ensureDefaultContent }
