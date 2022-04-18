class LoadUserByEmailRepository {
  async load (email) {
    return null
  }
}

const makeSut = () => {
  return new LoadUserByEmailRepository()
}

describe('LoadUserByEmail Repository', () => {
  it('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('unregisted_email@email.com')
    expect(user).toBe(null)
  })
})
