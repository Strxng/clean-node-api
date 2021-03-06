jest.mock('validator', () => ({
  isEmailValid: true,
  email: '',
  isEmail (email) {
    this.email = email
    return this.isEmailValid
  }
}))

const EmailValidator = require('./emailValidator')
const validator = require('validator')

const makeSut = () => {
  return new EmailValidator()
}

describe('Email validator', () => {
  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  it('Should return false if validator returns false', () => {
    validator.isEmailValid = false
    const sut = makeSut()
    const isEmailValid = sut.isValid('invalid_email@email.com')
    expect(isEmailValid).toBe(false)
  })

  it('Granted validator recieve an correctly email', () => {
    const sut = makeSut()
    const email = 'any_email@email.com'
    sut.isValid(email)
    expect(validator.email).toBe(email)
  })
})
