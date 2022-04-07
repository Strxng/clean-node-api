const Jwt = require('jsonwebtoken')
const { MissingParamError } = require('./errors')

module.exports = class TokenGenerator {
  constructor (secret) {
    this.secret = secret
  }

  async generate (payload) {
    if (!this.secret) {
      throw new MissingParamError('secret')
    }
    if (!payload) {
      throw new MissingParamError('payload')
    }
    return Jwt.sign(payload, this.secret)
  }
}
