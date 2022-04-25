const LoginRouter = require('../../presentation/routers/loginRouter')
const AuthUseCase = require('../../domain/usecases/authUseCase')
const EmailValidator = require('../../utils/helpers/emailValidator')
const LoadUserByEmailRepository = require('../../infra/repositories/loadUserByEmailRepository')
const UpdateAccessTokenRepository = require('../../infra/repositories/updateAccessTokenRepository')
const TokenGenerator = require('../../utils/helpers/tokenGenerator')
const Encrypter = require('../../utils/helpers/encrypter')
const { tokenSecret } = require('../config/env')

const loadUserByEmailRepository = new LoadUserByEmailRepository()
const updateAccessTokenRepository = new UpdateAccessTokenRepository()
const tokenGenerator = new TokenGenerator(tokenSecret)
const encrypter = new Encrypter()

const authUseCase = new AuthUseCase({
  loadUserByEmailRepository,
  updateAccessTokenRepository,
  tokenGenerator,
  encrypter
})

const emailValidator = new EmailValidator()
const loginRouter = new LoginRouter({
  authUseCase, emailValidator
})

module.exports = loginRouter
