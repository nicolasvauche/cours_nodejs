const bcrypt = require('bcrypt')
const { sequelize } = require('../services/db')
const Product = require('../models/product')
const User = require('../models/user')
const usersData = require('./data/usersData')
const productsData = require('./data/productsData')

async function loadUsers () {
  for (const user of usersData) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    await User.create({
      email: user.email,
      password: hashedPassword,
      bakeryName: user.bakeryName
    })
  }
}

async function loadProducts () {
  for (const product of productsData) {
    await Product.create(product)
  }
}

async function loadFixtures () {
  try {
    await sequelize.sync({ force: true })
    await loadUsers()
    await loadProducts()
    console.log('All fixtures loaded successfully')
  } catch (error) {
    console.error('Failed to load fixtures:', error)
  } finally {
    if (process.env.NODE_ENV !== 'test') {
      process.exit()
    }
  }
}

if (process.env.NODE_ENV !== 'test') {
  loadFixtures()
}

module.exports = { loadFixtures }
