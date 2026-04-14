const express = require('express')
const { createInquiry, getInquiries, updateInquiry } = require('../controllers/inquiryController')
const { protectAdmin } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', createInquiry)
router.get('/', protectAdmin, getInquiries)
router.patch('/:id', protectAdmin, updateInquiry)

module.exports = router