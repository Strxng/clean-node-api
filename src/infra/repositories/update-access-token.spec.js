const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')
let userModel

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }
    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }

    await this.userModel.updateOne({ _id: userId }, { $set: { accessToken } })
  }
}

const makeSut = () => {
  return new UpdateAccessTokenRepository(userModel)
}

describe('UpdateAccessToken Repository tests', () => {
  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__)
    userModel = await MongoHelper.db.collection('user')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('Should update the user with the given access token', async () => {
    const sut = makeSut()

    const userAdd = await userModel.insertOne({
      email: 'registed_email@email.com',
      password: '123'
    })

    await sut.update(userAdd.insertedId, 'valid_access_token')

    const userGet = await userModel.findOne({ _id: userAdd.insertedId })
    expect(userGet.accessToken).toBe('valid_access_token')
  })

  it('Should UpdateAccessTokenRepo throws if userModel is not provided', async () => {
    const sut = new UpdateAccessTokenRepository()
    const userAdd = await userModel.insertOne({
      email: 'registed_email@email.com',
      password: '123'
    })

    const promise = sut.update(userAdd.insertedId, 'valid_access_token')
    expect(promise).rejects.toThrow()
  })

  it('Should UpdateAccessTokenRepo throws if no params is provided', async () => {
    const sut = makeSut()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  it('Should updateAccessTokenRepo throws if no accessToken is provided', async () => {
    const sut = makeSut()
    const userAdd = await userModel.insertOne({
      email: 'registed_email@email.com',
      password: '123'
    })

    const promise = sut.update(userAdd.insertedId, '')
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
