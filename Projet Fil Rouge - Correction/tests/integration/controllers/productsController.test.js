const request = require('supertest')
const app = require('../../../app')
const { loadFixtures } = require('../../../fixtures/loadFixtures')
const { sequelize } = require('../../../services/db')
const jwt = require('jsonwebtoken')

let token
const productId = 1
const userId = 1
const nonExistentUserId = 9999
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

describe('Products Controller Integration Tests', () => {
  describe('GET /products', () => {
    it('should retrieve all products', async () => {
      const res = await request(app).get('/api/products')
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeInstanceOf(Array)
    })
  })

  describe('GET /products/:id', () => {
    it('should return a product if it exists', async () => {
      const res = await request(app).get(`/api/products/${productId}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('id', productId)
    })

    it('should return 404 if the product does not exist', async () => {
      const res = await request(app).get('/api/products/9999')
      expect(res.statusCode).toEqual(404)
    })
  })

  describe('getProductsByUserId', () => {
    it('should retrieve products for a given user ID', async () => {
      const res = await request(app).get(`/api/products/user/${userId}`)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toBeInstanceOf(Array)
    })

    it('should return 404 if the user does not exist', async () => {
      const res = await request(app).get(
        `/api/products/user/${nonExistentUserId}`
      )
      expect(res.statusCode).toEqual(404)
    })
  })

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const newProduct = {
        name: 'New Product',
        price: 20.0,
        status: 'En vente'
      }
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send(newProduct)
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('id')
    })
  })

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updatedProduct = {
        name: 'Updated Product',
        price: 25.0,
        created_at: '2023-04-09T06:46:01.000Z'
      }
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedProduct)
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('name', updatedProduct.name)
    })
  })

  describe('updateProductsStatus', () => {
    it('should update the status and price of products based on reduction rate', async () => {
      const reductionRate = 25
      const res = await request(app)
        .put('/api/products/user/status')
        .set('Authorization', `Bearer ${token}`)
        .send({ reductionRate })
      expect(res.statusCode).toEqual(200)
    })
  })

  describe('deleteProduct', () => {
    it('should delete an existing product', async () => {
      const res = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
    })
  })
})
