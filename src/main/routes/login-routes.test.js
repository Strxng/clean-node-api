const request = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../config/app')
const MongoHelper = require('../../infra/helpers/mongo-helper')
let userModel

describe('Test for LoginRoutes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    userModel = await MongoHelper.getCollection('users')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should Return 200 when valid credentials are provided', async () => {
    await userModel.insertOne({
      email: 'valid_email@email.com',
      password: bcrypt.hashSync('valid_pass', 10)
    })

    await request(app).post('/api/login').send({
      email: 'valid_email@email.com',
      password: 'valid_pass'
    }).expect(200)
  })

  it('Should Return 401 when invalid credentials are provided', async () => {
    await request(app).post('/api/login').send({
      email: 'invalid_email@email.com',
      password: 'invalid_pass'
    }).expect(401)
  })
})
