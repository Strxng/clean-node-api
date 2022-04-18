const { MongoClient } = require('mongodb')
class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

describe('LoadUserByEmail Repository', () => {
  let client, userModel

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
    const sut = new LoadUserByEmailRepository(userModel)
    const user = await sut.load('unregisted_email@email.com')
    expect(user).toBe(null)
  })

  it('Should return an user if user if found', async () => {
    const sut = new LoadUserByEmailRepository(userModel)
    await userModel.insertOne({
      email: 'registed_email@email.com'
    })
    const user = await sut.load('registed_email@email.com')
    expect(user.email).toBe('registed_email@email.com')
  })
})
