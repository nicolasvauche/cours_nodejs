const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Authentication failed' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, bakeryName: user.bakeryName },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
