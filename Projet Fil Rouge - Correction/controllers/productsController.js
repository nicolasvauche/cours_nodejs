const Product = require('../models/product')
const User = require('../models/user')
const { Sequelize } = require('sequelize')

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
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
    const user = await User.findByPk(req.params.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const products = await Product.findAll({
      where: { userId: req.params.userId }
    })

    return res.json(products)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

exports.createProduct = async (req, res) => {
  const newProduct = req.body
  newProduct.userId = req.userInfos.userId

  try {
    const product = await Product.create(newProduct)
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    })
    if (updated) {
      const updatedProduct = await Product.findByPk(req.params.id)
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
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    })
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

    const productsToUpdate = await Product.findAll({
      where: {
        userId: req.userInfos.userId,
        created_at: {
          [Sequelize.Op.lte]: fourHoursAgo
        },
        status: 'En vente'
      }
    })

    if (productsToUpdate.length > 0) {
      await Promise.all(
        productsToUpdate.map(product => {
          const reducedPrice =
            product.price - product.price * (reductionRate / 100)
          return product.update({ price: reducedPrice, status: 'Invendu' })
        })
      )

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
