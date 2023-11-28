/* eslint-disable no-restricted-syntax */
import { IValidator } from '@src/main/adapters/ports/validator';

import { Either, left, right } from '../Either';
import { MissingParamError } from './errors/missing-param-error';

export class RequiredFieldsValidator<T> implements IValidator<T> {
  validate(data: T, requiredParams: string[]): Either<MissingParamError, null> {
    for (const field of requiredParams) {
      if (
        data[field] === null ||
        data[field] === undefined ||
        (typeof data[field] === 'string' && data[field].trim() === '')
      ) {
        return left(new MissingParamError(field));
      }
    }

    return right(null);
  }
}
