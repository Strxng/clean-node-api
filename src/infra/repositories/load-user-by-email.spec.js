const { MongoClient } = require('mongodb')
let client, userModel

class LoadUserByEmailRepository {
  constructor (userModel) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email }, {
      projection: { password: 1 }
    })
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
    const userAdd = await userModel.insertOne({
      email: 'registed_email@email.com',
      password: '123'
    })
    const userGet = await userModel.findOne({ _id: userAdd.insertedId })

    const user = await sut.load('registed_email@email.com')
    expect(user).toEqual({
      _id: userGet._id,
      password: userGet.password
    })
  })
})
