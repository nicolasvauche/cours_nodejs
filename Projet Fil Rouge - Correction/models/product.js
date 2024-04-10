const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['En vente', 'Invendu']
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
  }
)

module.exports = mongoose.model('Product', productSchema)
