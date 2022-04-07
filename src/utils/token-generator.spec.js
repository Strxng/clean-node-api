class TokenGenerator {
  async generate (id) {
    return null
  }
}

const makeSut = () => {
  return new TokenGenerator()
}

describe('token generator', () => {
  it('should return null if jwt return null', async () => {
    const sut = makeSut()
    const token = await sut.generate('any_id')
    expect(token).toBe(null)
  })
})
