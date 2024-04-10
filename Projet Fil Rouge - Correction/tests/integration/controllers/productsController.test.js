const request = require('supertest')
const app = require('../../../app')
const Product = require('../../../models/product')
const User = require('../../../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

let token
const productId = mongoose.Types.ObjectId()
const userId = mongoose.Types.ObjectId()
const nonExistentUserId = mongoose.Types.ObjectId()
const userPayload = {
  userId: userId,
  email: 'bob@bakeapi.com',
  bakeryName: 'Ma petite boulangerie'
}

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  await Product.deleteMany({})
  await User.deleteMany({})
  const user = new User(userPayload)
  await user.save()
  const product = new Product({
    _id: productId,
    name: 'Test Product',
    price: 20.0,
    status: 'En vente',
    userId: user._id
  })
  await product.save()
  token = jwt.sign(userPayload, process.env.JWT_SECRET)
})

afterAll(async () => {
  await mongoose.disconnect()
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
      expect(res.body).toHaveProperty('_id', productId.toString())
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
      expect(res.body).toHaveProperty('_id')
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
