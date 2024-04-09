exports.index = (req, res) => {
  res.json({
    message: 'Welcome to BakeAPI!',
    documentation: '/api-docs'
  })
}

exports.protected = (req, res) => {
  res.json({
    message: 'This endpoint is protected!'
  })
}
