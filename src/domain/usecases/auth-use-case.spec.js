
class AuthUseCase {
  async auth () {
    return new Error()
  }
}

const makeSut = () => {
  return new AuthUseCase()
}

describe('authUseCase', () => {
  it('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promisse = sut.auth()
    expect(promisse).rejects.toThrow()
  })
})
