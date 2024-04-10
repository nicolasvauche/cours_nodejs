const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true
    },
    bakeryName: {
      type: String,
      required: false
    }
  },
  {
    timestamps: false,
    versionKey: false
  }
)

module.exports = mongoose.model('User', userSchema)
