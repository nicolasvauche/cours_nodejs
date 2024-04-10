const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../../app')
const { sequelize } = require('../../../services/db')
const { loadFixtures } = require('../../../fixtures/loadFixtures')

let token
const otherToken = 'Bad token'
const productId = 1
const userPayload = {
  userId: 1,
  email: 'bob@bakeapi.com',
  bakeryName: 'Ma petite boulangerie'
}

beforeAll(async () => {
  await sequelize.sync({ force: true })
  await loadFixtures()
  token = jwt.sign(userPayload, process.env.JWT_SECRET)
})

afterAll(async () => {
  await sequelize.close()
})

describe('checkProductOwnership Middleware', () => {
  it('should deny access if user is not the owner of the product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(403)
  })

  it('should grant access if user is the owner of the product', async () => {
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(200)
  })

  it('should return a 404 if the product was not found', async () => {
    const res = await request(app)
      .put('/api/products/9999')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(404)
  })

  it('should return a 500 if the db connection is closed', async () => {
    await sequelize.close()
    const res = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Product', price: 15.0, status: 'Invendu' })
    expect(res.statusCode).toEqual(500)
  })
})
