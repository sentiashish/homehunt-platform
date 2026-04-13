const express = require('express')
const { getContent, updateContent } = require('../controllers/contentController')
const { protectAdmin } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getContent)
router.put('/', protectAdmin, updateContent)

module.exports = router
