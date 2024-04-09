const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.JWT_SECRET

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Access unauthorized' })

  jwt.verify(token, SECRET_KEY, (err, tokenDecoded) => {
    if (err) return res.status(403).json({ error: 'Access forbidden' })
    req.userInfos = tokenDecoded
    next()
  })
}

module.exports = auth
