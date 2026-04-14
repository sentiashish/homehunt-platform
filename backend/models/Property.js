const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
      trim: true,
    },
    url: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
  },
  { _id: false }
)

const propertySchema = new mongoose.Schema(
  {
    legacyId: { type: String, trim: true, index: true, unique: true, sparse: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    area: { type: Number, required: true, min: 0 },
    yearBuilt: { type: Number, default: null },
    featured: { type: Boolean, default: false },
    description: { type: String, required: true, trim: true },
    amenities: { type: [String], default: [] },
    media: { type: [mediaSchema], default: [] },
    image: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    videos: { type: [String], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Property', propertySchema)