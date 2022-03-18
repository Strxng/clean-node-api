const LoginRouter = require('./loginRouter')
const MissingParamError = require('../helpers/missingParamError')
const UnauthorizedError = require('../helpers/unauthorizedError')

const makeSut = () => {
  class AuthUseCaseSpy {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  const authUseCaseSpy = new AuthUseCaseSpy()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy)

  return {
    sut,
    authUseCaseSpy
  }
}

// Testes
describe('Login router', () => {
  it('Should return 500 if no httpRequest is provided', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if no httpRequest has no body', () => {
    const { sut } = makeSut()
    const httpResponse = sut.route({})
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should call authUseCase with correct params', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 500 if no authUseCase is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 500 if authUseCase has no auth method', () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 401 when invalid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_pass'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 when valid credentials are provided', () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_pass'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })
})
