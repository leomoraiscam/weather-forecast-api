import { AccountAlreadyExistsError } from '@src/application/usecases/users/errors/account-already-exists-error';
import { InvalidEmailError } from '@src/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@src/entities/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '@src/entities/user/errors/invalid-password-length-error';
import { Either } from '@src/shared/core/either';

import { RegisterUserInput } from '../../dtos/register-user-input';
import { RegisterUserOutput } from '../../dtos/register-user-output';

export type RegisterUserResponse = Either<
  AccountAlreadyExistsError | InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
  RegisterUserOutput
>;
export interface IRegisterUserUseCase {
  execute: (registerUserInput: RegisterUserInput) => Promise<RegisterUserResponse>;
}
