const { DataTypes } = require('sequelize')
const { sequelize } = require('../services/db')

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bakeryName: {
      type: DataTypes.STRING,
      field: 'bakery_name'
    }
  },
  {
    tableName: 'users',
    timestamps: false
  }
)

module.exports = User
