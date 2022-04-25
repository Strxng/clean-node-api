const request = require('supertest')
const app = require('../config/app')

describe('Content-type Middleware', () => {
  it('Should return json content-type as default', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send('')
    })

    await request(app).get('/test_content_type').expect('content-type', /json/)
  })

  it('Should return xml content-type is forced', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml')
      res.send('')
    })

    await request(app).get('/test_content_type_xml').expect('content-type', /xml/)
  })
})
