const Jwt = require('jsonwebtoken')

class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (payload) {
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
})
