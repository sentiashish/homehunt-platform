const express = require('express')
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController')
const { protectAdmin } = require('../middleware/authMiddleware')

const router = express.Router()

router.get('/', getProperties)
router.get('/:id', getPropertyById)
router.post('/', protectAdmin, createProperty)
router.put('/:id', protectAdmin, updateProperty)
router.delete('/:id', protectAdmin, deleteProperty)

module.exports = router