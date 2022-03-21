const HttpResponse = require('../helpers/httpResponse')
const InvalidParamError = require('../helpers/invalidParamError')
const MissingParamError = require('../helpers/missingParamError')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'))
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'))
      }

      const acessToken = await this.authUseCase.auth(email, password)
      if (!acessToken) {
        return HttpResponse.unauthorizedError()
      }

      return HttpResponse.ok({ acessToken })
    } catch (error) {
      // console.error('LoginRouter.route.error: ', error)
      return HttpResponse.serverError()
    }
  }
}
