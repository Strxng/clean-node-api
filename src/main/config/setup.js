const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/jsonParser.js')
const contentType = require('../middlewares/contentType')

module.exports = app => {
  app.disable('x-powered-by')
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}
