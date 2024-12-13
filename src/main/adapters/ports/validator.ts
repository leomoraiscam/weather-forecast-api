import { Either } from '@src/shared/core/either';
import { ValidatableData } from '@src/shared/validators/required-fields-validator';

export interface IValidator<T> {
  validate(data: ValidatableData<T>, requiredParams: string[]): Either<Error, null>;
}
