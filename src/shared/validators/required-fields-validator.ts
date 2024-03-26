import { IValidator } from '@src/main/adapters/ports/validator';

import { Either, left, right } from '../logic/either';
import { MissingParamError } from './errors/missing-param-error';

export type ValidatableData<T> = {
  [K in keyof T]: T[K];
};

export class RequiredFieldsValidator<T> implements IValidator<ValidatableData<T>> {
  validate(data: ValidatableData<T>, requiredParams: string[]): Either<MissingParamError, null> {
    for (const field of requiredParams) {
      if (
        data[field as keyof T] === null ||
        data[field as keyof T] === undefined ||
        String(data[field as keyof T]).trim() === ''
      ) {
        return left(new MissingParamError(String(field)));
      }
    }

    return right(null);
  }
}
