const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../../../app')

describe('Auth Middleware', () => {
  it('should deny access if no token is provided', async () => {
    const res = await request(app).get('/api/protected')
    expect(res.statusCode).toEqual(401)
  })

  it('should deny access if the token is invalid', async () => {
    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalid-token')
    expect(res.statusCode).toEqual(403)
  })

  it('should grant access if the token is valid', async () => {
    const userPayload = {
      userId: 1,
      email: 'bob@bakeapi.com',
      bakeryName: 'Ma petite boulangerie'
    }
    const token = jwt.sign(userPayload, process.env.JWT_SECRET)

    const res = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200)
  })
})
