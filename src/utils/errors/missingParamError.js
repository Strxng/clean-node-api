module.exports = class MissingParamError extends Error {
  constructor (missingParam) {
    super(`Missing param: ${missingParam}`)
    this.name = 'MissingParamError'
  }
}
