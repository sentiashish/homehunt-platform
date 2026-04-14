const mongoose = require('mongoose')

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI

  if (!mongoUri) {
    throw new Error('MongoDB URI is missing. Set MONGODB_URI (or MONGO_URI) in backend/.env')
  }

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}

module.exports = connectDB
