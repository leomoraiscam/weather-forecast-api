import bcrypt from 'bcryptjs'

import { Password } from './password'
import { InvalidPasswordLengthError } from "./errors/invalid-password-length-error"

describe('User password value object', () => {
  it('should accept valid password', () => {
    const passwordOrError = Password.create('123456')

    expect(passwordOrError).toHaveProperty('password')
  })

  it('should reject password with less than 6 characters', () => {
    expect(() => Password.create('12345')).toThrow(InvalidPasswordLengthError)
  })

  it('should reject password with more than 255 characters', () => {
    expect(() => Password.create('1'.repeat(260))).toThrow(InvalidPasswordLengthError)
  })

  it('should be able to hash the password', async () => {
    const password = Password.create('123456')

    if (password instanceof InvalidPasswordLengthError) {
      throw new Error()
    }

    const hashedPassword = await password.getHashedValue()

    expect(await bcrypt.compare('123456', hashedPassword)).toBeTruthy()
  })

  it('should not hash the password when already hashed', async () => {
    const hashedPassword = await bcrypt.hash('123456', 8)
    const password = Password.create(hashedPassword, true)

    if (password instanceof InvalidPasswordLengthError) {
      throw new Error()
    }

    expect(await password.getHashedValue()).toEqual(hashedPassword)
  })

  it('should be able to compare the password when not hashed', async () => {
    const password = Password.create('123456')

    if (password instanceof InvalidPasswordLengthError) {
      throw new Error()
    }

    expect(password.comparePassword('123456')).toBeTruthy()
  })

  it('should be able to compare the password when hashed', async () => {
    const hashedPassword = await bcrypt.hash('123456', 8)
    const password = Password.create(hashedPassword, true)

    if (password instanceof InvalidPasswordLengthError) {
      throw new Error()
    }

    expect(password.comparePassword('123456')).toBeTruthy()
  })
})
