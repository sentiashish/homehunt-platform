const jwt = require('jsonwebtoken')

function verifyToken(req, res) {
  const authHeader = req.headers.authorization || ''

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: token missing' })
    return null
  }

  const token = authHeader.replace('Bearer ', '').trim()

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: invalid token' })
    return null
  }
}

function protectAdmin(req, res, next) {
  const payload = verifyToken(req, res)
  if (!payload) {
    return
  }

  if (payload.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: admin access required' })
  }

  req.admin = payload
  return next()
}

function protectUser(req, res, next) {
  const payload = verifyToken(req, res)
  if (!payload) {
    return
  }

  if (payload.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: user access required' })
  }

  req.user = payload
  return next()
}

module.exports = { protectAdmin, protectUser }
