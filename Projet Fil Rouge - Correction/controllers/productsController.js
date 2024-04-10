const Product = require('../models/product')
const User = require('../models/user')

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getProductsByUserId = async (req, res) => {
  try {
    const userExists = await User.exists({ _id: req.params.userId })
    if (!userExists) {
      return res.status(404).json({ error: 'User not found' })
    }

    const products = await Product.find({ userId: req.params.userId })
    return res.json(products)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

exports.createProduct = async (req, res) => {
  const newProductData = req.body
  newProductData.userId = req.userInfos.userId

  try {
    const newProduct = new Product(newProductData)
    const savedProduct = await newProduct.save()
    res.status(201).json(savedProduct)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (updatedProduct) {
      res.status(200).json(updatedProduct)
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id)
    if (deleted) {
      res.status(200).json({ message: 'Product successfully deleted' })
    } else {
      res.status(404).json({ error: 'Product not found' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProductsStatus = async (req, res) => {
  try {
    const reductionRate = req.body.reductionRate
    if (
      typeof reductionRate !== 'number' ||
      reductionRate <= 0 ||
      reductionRate >= 100
    ) {
      return res.status(400).json({ error: 'Invalid reduction rate' })
    }

    const fourHoursAgo = new Date(new Date() - 4 * 60 * 60 * 1000)

    const productsToUpdate = await Product.find({
      userId: req.userInfos.userId,
      created_at: { $lte: fourHoursAgo },
      status: 'En vente'
    })

    if (productsToUpdate.length > 0) {
      const updatePromises = productsToUpdate.map(product => {
        product.price -= product.price * (reductionRate / 100)
        product.status = 'Invendu'
        return product.save()
      })
      await Promise.all(updatePromises)

      res.status(200).json({
        message: `${productsToUpdate.length} Product(s) status and price successfully updated`
      })
    } else {
      res.status(404).json({ error: 'No product to update' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
