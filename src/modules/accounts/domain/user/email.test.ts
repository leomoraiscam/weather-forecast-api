import { Email } from './email'
import { InvalidEmailError } from "./errors/invalid-email-error"

describe('User email value object', () => {
  it('should accept valid email address', () => {
    const emailOrError = Email.create('johndoe@example.com')

    expect(emailOrError).toHaveProperty('email')
  })

  it('should reject invalid email address', () => {
    expect(() => Email.create('johndoe')).toThrow(InvalidEmailError)
    expect(() => Email.create('johndoe@example')).toThrow(InvalidEmailError)
    expect(() => Email.create('@example.com')).toThrow(InvalidEmailError)
    expect(() => Email.create('johndoe@example.')).toThrow(InvalidEmailError)
  })

  it('should reject emails with more than 255 characters', () => {
    const domain = 'c'.repeat(260)
    
    expect(() => Email.create(`johndoe@${domain}.com`)).toThrow(InvalidEmailError)
  })
})
