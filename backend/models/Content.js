const mongoose = require('mongoose')

const amenitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const constructionUpdateSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { _id: false }
)

const contentSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
    },
    overview: { type: String, required: true, trim: true },
    connectivity: { type: String, required: true, trim: true },
    amenities: { type: [amenitySchema], default: [] },
    about: { type: String, required: true, trim: true },
    constructionUpdates: { type: [constructionUpdateSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Content', contentSchema)
