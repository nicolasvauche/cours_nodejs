const Product = require('../models/product')

const checkProductOwnership = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (product.userId !== req.userInfos.userId) {
      return res.status(403).json({
        error: 'You are not authorized to perform this action on this product'
      })
    }

    next()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = checkProductOwnership
