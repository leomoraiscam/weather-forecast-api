import bcrypt from 'bcryptjs';

import { Either, left, right } from '@src/shared/core/either';

import { InvalidPasswordLengthError } from './errors/invalid-password-length-error';

export class Password {
  private readonly password: string;
  private readonly hashed?: boolean;

  private constructor(password: string, hashed: boolean) {
    this.password = password;
    this.hashed = hashed;
  }

  public async getHashedValue(): Promise<string> {
    if (this.hashed) {
      return this.password;
    }

    return bcrypt.hash(this.password, 8);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.hashed) {
      hashed = this.password;

      return bcrypt.compare(plainTextPassword, hashed);
    }

    return this.password === plainTextPassword;
  }

  static validate(password: string): boolean {
    if (!password || password.trim().length < 6 || password.trim().length > 255) {
      return false;
    }

    return true;
  }

  static create(
    password: string,
    hashed: boolean = false,
  ): Either<InvalidPasswordLengthError, Password> {
    if (!hashed && !this.validate(password)) {
      return left(new InvalidPasswordLengthError());
    }

    return right(new Password(password, hashed));
  }
}
