const { DataTypes } = require('sequelize')
const { sequelize } = require('../services/db')
const User = require('./user')

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['En vente', 'Invendu']],
          msg: "The product status must be 'En vente' or 'Invendu'"
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    }
  },
  {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
)

User.hasMany(Product, { foreignKey: 'userId' })
Product.belongsTo(User, { foreignKey: 'userId' })

module.exports = Product
