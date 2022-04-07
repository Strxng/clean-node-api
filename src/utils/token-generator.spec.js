const Jwt = require('jsonwebtoken')

class TokenGenerator {
  async generate (id) {
    return Jwt.sign(id, 'secret')
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('token generator', () => {
  it('should return null if jwt return null', async () => {
    const sut = makeSut()
    Jwt.token = null
    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })

  it('should return a token if jwt returns a token', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(Jwt.token)
  })
})
