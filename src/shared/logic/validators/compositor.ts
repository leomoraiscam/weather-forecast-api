/* eslint-disable no-restricted-syntax */
import { IValidator } from '@src/main/adapters/ports/validator';

import { Either } from '../Either';

export class ValidatorCompositor<T = any> implements IValidator<T> {
  constructor(private readonly validators: IValidator<T>[]) {}

  validate(input: T): Either<Error, null> {
    for (const validator of this.validators) {
      const error = validator.validate(input);
      if (error !== null) return error;
    }

    return null;
  }
}
