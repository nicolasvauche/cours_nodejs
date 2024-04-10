const mongoose = require('mongoose')
const Product = require('../models/product')

const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (!product.userId.equals(req.userInfos.userId)) {
      return res.status(403).json({
        error: 'You are not authorized to perform this action on this product'
      })
    }

    next()
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }
    res.status(500).json({ error: error.message })
  }
}

module.exports = checkProductOwnership
