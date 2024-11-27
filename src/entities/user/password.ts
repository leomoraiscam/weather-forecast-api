import bcrypt from 'bcryptjs';

import { Either, left, right } from '@src/shared/logic/either';

import { InvalidPasswordLengthError } from './errors/invalid-password-length-error';

export class Password {
  private readonly password: string;
  private readonly hashed?: boolean;
  private SALT_RANDOM_BYTES = 8;

  private constructor(password: string, hashed: boolean) {
    this.password = password;
    this.hashed = hashed;
  }

  get value(): string {
    return this.password;
  }

  static validate(password: string): boolean {
    if (!password) {
      return false;
    }

    if (password.trim().length < 6 || password.trim().length > 20) {
      return false;
    }

    return true;
  }

  public isAlreadyHashed(): boolean {
    return this.hashed;
  }

  public async getHashedValue(): Promise<string> {
    if (this.isAlreadyHashed()) {
      return this.value;
    }

    return bcrypt.hash(this.value, this.SALT_RANDOM_BYTES);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string;

    if (this.hashed) {
      hashed = this.password;

      return bcrypt.compare(plainTextPassword, hashed);
    }

    return this.password === plainTextPassword;
  }

  static create(password: string, hashed = false): Either<InvalidPasswordLengthError, Password> {
    if (!hashed && !this.validate(password)) {
      return left(new InvalidPasswordLengthError());
    }

    return right(new Password(password, hashed));
  }
}
