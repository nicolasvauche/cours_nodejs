const { loadFixtures } = require('../../../fixtures/loadFixtures')
const { sequelize } = require('../../../services/db')
const Product = require('../../../models/product')
const User = require('../../../models/user')

beforeAll(async () => {
  await sequelize.sync({ force: true })
  await loadFixtures()
})

afterAll(async () => {
  await sequelize.close()
})

describe('Product Tests', () => {
  it('should find all products for a user', async () => {
    const user = await User.findOne()
    const products = await Product.findAll({
      where: { userId: user.id }
    })
    expect(products).not.toBeNull()
    expect(products.length).toBeGreaterThan(0)
  })
})
