import { Either } from '@src/shared/logic/either';
import { ValidatableData } from '@src/shared/validators/required-fields-validator';

export interface IValidator<T> {
  validate(data: ValidatableData<T>, requiredParams: string[]): Either<Error, null>;
}
