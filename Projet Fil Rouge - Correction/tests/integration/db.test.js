const { connectDB, sequelize } = require('../../services/db')

describe('Database Connection', () => {
  test('should connect without error', async () => {
    await expect(connectDB()).resolves.not.toThrow()
  })

  test('should handle connection error', async () => {
    const error = new Error('Connection failed')
    sequelize.authenticate = jest.fn().mockRejectedValueOnce(error)

    // Mock console.error pour vérifier qu'il est appelé correctement
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    // Étant donné que connectDB appelle process.exit(1) en cas d'échec,
    // nous devons également simuler process.exit pour éviter de terminer nos tests prématurément
    const originalProcessExit = process.exit
    process.exit = jest.fn()

    await connectDB()

    expect(process.exit).toHaveBeenCalledWith(1)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Unable to connect to the database:',
      error
    )

    // Nettoyage : restaurer les mocks
    consoleSpy.mockRestore()
    process.exit = originalProcessExit
  })
})

afterAll(async () => {
  await sequelize.close()
})
