require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./services/db')

let port = process.env.APP_PORT || 3000

const startServer = port => {
  connectDB()
    .then(() => {
      const server = app
        .listen(port, () => {
          console.log(`Server is listening on http://localhost:${port}`)
        })
        .on('error', err => {
          if (err.code === 'EADDRINUSE') {
            console.error(
              `Port ${port} is already in use, trying port ${
                parseInt(port) + 1
              }…`
            )
            startServer(parseInt(port) + 1)
          } else {
            console.error(err)
            process.exit(1)
          }
        })
    })
    .catch(err => {
      console.error('Database connection failed:', err)
      process.exit(1)
    })
}

startServer(port)
