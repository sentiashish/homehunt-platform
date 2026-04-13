const jwt = require('jsonwebtoken')

const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = '1234'

function loginAdmin(req, res) {
  const { email, password } = req.body || {}

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign(
    { email: ADMIN_EMAIL, role: 'admin' },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '12h' }
  )

  return res.status(200).json({
    success: true,
    token,
    admin: {
      email: ADMIN_EMAIL,
      role: 'admin',
    },
  })
}

module.exports = { loginAdmin }
