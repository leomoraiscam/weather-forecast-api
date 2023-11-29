import { Either } from '@src/shared/logic/either';

export interface IValidator<T> {
  validate(data: T, requiredParams: string[]): Either<Error, null>;
}
