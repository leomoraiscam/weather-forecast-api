import { Either, left, right } from '@src/shared/core/either';

import { InvalidNameError } from './errors/invalid-name-error';

export class Name {
  private readonly name: string;

  private constructor(name: string) {
    this.name = name;
  }

  get value(): string {
    return this.name;
  }

  static validate(name: string): boolean {
    if (!name) {
      return false;
    }

    if (name.trim().length < 2 || name.trim().length > 25) {
      return false;
    }

    return true;
  }

  static create(name: string): Either<InvalidNameError, Name> {
    if (!this.validate(name)) {
      return left(new InvalidNameError(name));
    }

    return right(new Name(name));
  }
}
