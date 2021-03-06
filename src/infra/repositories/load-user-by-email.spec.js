const LoadUserByEmailRepository = require('./loadUserByEmailRepository')
const { MissingParamError } = require('../../utils/errors')
const MongoHelper = require('../helpers/mongo-helper')
let userModel

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
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

  it('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('unregisted_email@email.com')
    expect(user).toBe(null)
  })

  it('Should LoadUserByEmail Repository throws if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  it('Should return an user if user is found', async () => {
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
