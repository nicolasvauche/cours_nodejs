exports.index = (req, res) => {
  res.json({
    message: 'Welcome to BakeAPI!',
    documentation: '/api-docs'
  })
}
