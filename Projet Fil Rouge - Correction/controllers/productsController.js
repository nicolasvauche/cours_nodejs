const Product = require('../models/product')

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

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
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