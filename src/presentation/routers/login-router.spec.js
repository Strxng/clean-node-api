const LoginRouter = require('./loginRouter')
const {
  MissingParamError,
  InvalidParamError,
  ServerError,
  UnauthorizedError
} = require('../errors')

const makeSut = () => {
  const authUseCaseSpy = makeAuthUseCase()
  const emailValidatorSpy = makeEmailValidator()
  authUseCaseSpy.acessToken = 'valid_token'
  const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

  return {
    sut,
    authUseCaseSpy,
    emailValidatorSpy
  }
}

const makeEmailValidator = () => {
  class EmailValidorSpy {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  const emailValidatorSpy = new EmailValidorSpy()
  emailValidatorSpy.isEmailValid = true
  return emailValidatorSpy
}

const makeAuthUseCase = () => {
  class AuthUseCaseSpy {
    async auth (email, password) {
      this.email = email
      this.password = password
      return this.acessToken
    }
  }
  return new AuthUseCaseSpy()
}

const makeAuthUserCaseWithError = () => {
  class AuthUseCaseSpy {
    async auth () {
      throw new Error('Falha')
    }
  }
  return new AuthUseCaseSpy()
}

const makeEmailValidatorWithError = () => {
  class EmailValidorSpy {
    isValid () {
      throw new Error('Falha')
    }
  }
  return new EmailValidorSpy()
}

// Testes
describe('Login router', () => {
  it('Should return 500 if no httpRequest is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if no httpRequest has no body', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.route({})
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should call authUseCase with correct params', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    await sut.route(httpRequest)
    expect(authUseCaseSpy.email).toBe(httpRequest.body.email)
    expect(authUseCaseSpy.password).toBe(httpRequest.body.password)
  })

  it('Should return 500 if no authUseCase is provided', async () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if authUseCase has no auth method', async () => {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 401 when invalid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    authUseCaseSpy.acessToken = null
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('Should return 200 when valid credentials are provided', async () => {
    const { sut, authUseCaseSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'valid_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body.acessToken).toEqual(authUseCaseSpy.acessToken)
  })

  it('Should return 500 if authUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUserCaseWithError()
    const sut = new LoginRouter(authUseCaseSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    emailValidatorSpy.isEmailValid = false
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalid_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should return 500 if no emailValidator is provided', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy)
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if emailValidator has no isValid method', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const sut = new LoginRouter(authUseCaseSpy, {})
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should return 500 if authUseCase throws', async () => {
    const authUseCaseSpy = makeAuthUseCase()
    const emailValidatorSpy = makeEmailValidatorWithError()
    const sut = new LoginRouter(authUseCaseSpy, emailValidatorSpy)

    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@email.com',
        password: 'any_pass'
      }
    }
    await sut.route(httpRequest)
    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
  })
})
