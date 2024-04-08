require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_USERPASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
)

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection has been established successfully')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }
