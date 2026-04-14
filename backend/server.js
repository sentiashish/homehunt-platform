const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const contentRoutes = require('./routes/contentRoutes')
const propertyRoutes = require('./routes/propertyRoutes')
const inquiryRoutes = require('./routes/inquiryRoutes')
const { ensureDefaultContent } = require('./controllers/contentController')
const { ensureDefaultProperties } = require('./controllers/propertyController')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const allowedOrigins = Array.from(
  new Set(
    [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ].filter(Boolean)
  )
)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error(`CORS blocked for origin: ${origin}`))
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/inquiries', inquiryRoutes)

app.use(notFound)
app.use(errorHandler)

async function start() {
  try {
    await connectDB()
    await ensureDefaultContent()
    await ensureDefaultProperties()

    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`)
    })
  } catch (error) {
    console.error('Server startup error:', error)
    process.exit(1)
  }
}

start()
