const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepository = require('./updateAccessTokenRepository')

let userModel

const makeSut = () => {
  return new UpdateAccessTokenRepository(userModel)
}

describe('UpdateAccessToken Repository tests', () => {
  let userInsertedId

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    userModel = await MongoHelper.db.collection('user')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
    const userAdd = await userModel.insertOne({
      email: 'registed_email@email.com',
      password: '123'
    })
    userInsertedId = userAdd.insertedId
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should update the user with the given access token', async () => {
    const sut = makeSut()
    await sut.update(userInsertedId, 'valid_access_token')
    const userGet = await userModel.findOne({ _id: userInsertedId })
    expect(userGet.accessToken).toBe('valid_access_token')
  })

  it('Should UpdateAccessTokenRepo throws if userModel is not provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const promise = sut.update(userInsertedId, 'valid_access_token')
    expect(promise).rejects.toThrow()
  })

  it('Should UpdateAccessTokenRepo throws if no params is provided', async () => {
    const sut = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  it('Should updateAccessTokenRepo throws if no accessToken is provided', async () => {
    const sut = makeSut()
    const promise = sut.update(userInsertedId, '')
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
