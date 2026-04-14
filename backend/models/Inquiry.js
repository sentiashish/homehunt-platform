const mongoose = require('mongoose')

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    property: { type: String, default: 'General Enquiry', trim: true },
    propertyId: { type: String, default: '', trim: true },
    message: { type: String, required: true, trim: true },
    source: { type: String, default: 'website', trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'archived'],
      default: 'new',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Inquiry', inquirySchema)