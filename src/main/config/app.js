const express = require('express')
const app = express()
const setupApp = require('./setupApp')
const setupRoutes = require('./setupRoutes')

setupApp(app)
setupRoutes(app)

module.exports = app
