module.exports = {
  token: 'any_token',
  sign (payload, secret) {
    return this.token
  }
}
