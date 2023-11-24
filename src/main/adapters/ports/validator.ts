import { Either } from '@src/shared/logic/Either';

export interface IValidator<T> {
  validate(data: T): Either<Error, null>;
}
