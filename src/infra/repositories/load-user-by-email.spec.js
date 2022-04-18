const { MongoClient } = require('mongodb')
let client, userModel

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

const makeSut = () => {
  return new LoadUserByEmailRepository(userModel)
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    client = await MongoClient.connect(global.__MONGO_URI__)
    userModel = await client.db().collection('user')
  })

  beforeEach(async () => {
    await userModel.deleteMany()
  })

  afterAll(async () => {
    await client.close()
  })

  it('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('unregisted_email@email.com')
    expect(user).toBe(null)
  })

  it('Should return an user if user if found', async () => {
    const sut = makeSut()
    await userModel.insertOne({
      email: 'registed_email@email.com'
    })
    const user = await sut.load('registed_email@email.com')
    expect(user.email).toBe('registed_email@email.com')
  })
})
