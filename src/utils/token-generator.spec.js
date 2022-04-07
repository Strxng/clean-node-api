const Jwt = require('jsonwebtoken')
const { MissingParamError } = require('./errors')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (payload) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!payload) {
      throw new MissingParamError('payload')
    }
    return Jwt.sign(payload, this.secret)
  }
}

const makeSut = () => {
  return new TokenGenerator('secret')
}

describe('token generator', () => {
  it('should return null if jwt return null', async () => {
    const sut = makeSut()
    Jwt.token = null
    const token = await sut.generate('any_payload')
    expect(token).toBe(null)
  })

  it('should return a token if jwt returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_payload')
    expect(token).toBe(Jwt.token)
  })

  it('should call jwt with correct values', async () => {
    const sut = makeSut()
    await sut.generate('any_payload')
    expect(Jwt.payload).toBe('any_payload')
    expect(Jwt.secret).toBe(sut.secret)
  })

  it('should throw if no secret is provided', () => {
    const sut = new TokenGenerator()
    const promise = sut.generate('any_payload')
    expect(promise).rejects.toThrow(new MissingParamError('secret'))
  })

  it('should throw if no payload is provided', () => {
    const sut = makeSut()
    const promise = sut.generate()
    expect(promise).rejects.toThrow(new MissingParamError('payload'))
  })
})
