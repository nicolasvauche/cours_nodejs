const bcrypt = require('bcrypt')
const { connectDB } = require('../services/db')
const User = require('../models/user')
const Product = require('../models/product')
const usersData = require('./data/usersData')
const productsData = require('./data/productsData')

async function loadUsers () {
  await User.deleteMany()
  const users = []
  for (const userData of usersData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    const user = new User({
      email: userData.email,
      password: hashedPassword,
      bakeryName: userData.bakeryName
    })
    const savedUser = await user.save()
    users.push(savedUser)
  }
  return users
}

async function loadProducts (users) {
  await Product.deleteMany()
  for (const productData of productsData) {
    const { userId, ...productDetails } = productData
    const user = users[userId - 1]
    await new Product({
      ...productDetails,
      userId: user._id
    }).save()
  }
}

async function loadFixtures () {
  try {
    await connectDB()
    console.log('Database connection has been established successfully.')
    const users = await loadUsers()
    await loadProducts(users)
    console.log('All fixtures loaded successfully.')
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
