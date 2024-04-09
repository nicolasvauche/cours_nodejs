const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../../app')
const { sequelize } = require('../../../services/db')
const Product = require('../../../models/product')
const User = require('../../../models/user')

describe('checkProductOwnership Middleware', () => {
  let user, otherUser, product, token, otherToken

  beforeAll(async () => {
    await sequelize.sync({ force: true })
    user = await User.create({
      email: 'user@example.com',
      password: 'password',
      bakeryName: 'User Bakery'
    })
    otherUser = await User.create({
      email: 'other@example.com',
      password: 'password',
      bakeryName: 'Other Bakery'
    })
    product = await Product.create({
      name: 'Test Product',
      price: 10.0,
      userId: user.id,
      status: 'En vente'
    })
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET)
    otherToken = jwt.sign({ userId: otherUser.id }, process.env.JWT_SECRET)
  })

  it('should deny access if user is not the owner of the product', async () => {
    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(403)
  })

  it('should grant access if user is the owner of the product', async () => {
    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(200)
  })

  it('should return a 404 if the product was not found', async () => {
    const res = await request(app)
      .put('/api/products/4')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(404)
  })

  it('should return a 500 if the db connection is closed', async () => {
    await sequelize.close()
    const res = await request(app)
      .put(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(500)
  })

  afterAll(async () => {
    await sequelize.close()
  })
})
