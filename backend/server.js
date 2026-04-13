const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const contentRoutes = require('./routes/contentRoutes')
const { ensureDefaultContent } = require('./controllers/contentController')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
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

app.use(notFound)
app.use(errorHandler)

async function start() {
  try {
    await connectDB()
    await ensureDefaultContent()

    app.listen(port, () => {
      console.log(`Backend server running on port ${port}`)
    })
  } catch (error) {
    console.error('Server startup error:', error)
    process.exit(1)
  }
}

start()
