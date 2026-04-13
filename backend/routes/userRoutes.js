const express = require('express')
const { signupUser, loginUser, getCurrentUser } = require('../controllers/userController')
const { protectUser } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/me', protectUser, getCurrentUser)

module.exports = router
