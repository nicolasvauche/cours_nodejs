const request = require('supertest')
const app = require('../../app')

describe('GET /', () => {
  it('should respond with a welcome message and a link to the Swagger documentation', async () => {
    const response = await request(app).get('/api')
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      message: 'Welcome to BakeAPI!',
      documentation: '/api-docs'
    })
  })
})
