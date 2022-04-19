const MongoHelper = require('../helpers/mongo-helper')
let userModel

class UpdateAccessTokenRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
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
})
