const HttpResponse = require('../helpers/httpResponse')
const MissingParamError = require('../helpers/missingParamError')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'))
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
