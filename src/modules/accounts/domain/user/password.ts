import bcrypt from 'bcryptjs'
import { InvalidPasswordLengthError } from './errors/invalid-password-length-error'
import { Either, left, right } from '@src/shared/logic/Either'

export class Password {
  private readonly password: string
  private readonly hashed?: boolean

  private constructor(password: string, hashed: boolean) {
    this.password = password
    this.hashed = hashed
  }

  get value(): string {
    return this.password
  }

  static validate(password: string): boolean {
    if (
      !password ||
      password.trim().length < 6 ||
      password.trim().length > 255
    ) {
      return false
    }

    return true
  }

  public async getHashedValue(): Promise<string> {
    if (this.hashed) {
      return this.password
    }

    return await bcrypt.hash(this.password, 8)
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string

    if (this.hashed) {
      hashed = this.password

      return await bcrypt.compare(plainTextPassword, hashed)
    }

    return this.password === plainTextPassword
  }

  static create(
    password: string,
    hashed: boolean = false
  ): Either<InvalidPasswordLengthError, Password>  {
    if (!hashed && !this.validate(password)) {
      return left(new InvalidPasswordLengthError())
    }

    return right(new Password(password, hashed))
  }
}
