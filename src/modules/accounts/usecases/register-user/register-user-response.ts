import { InvalidEmailError } from '@src/modules/accounts/domain/user/errors/invalid-email-error';
import { InvalidNameError } from '@src/modules/accounts/domain/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '@src/modules/accounts/domain/user/errors/invalid-password-length-error';
import { IRegisteredUserDTO } from '@src/modules/accounts/dtos/registered-user';
import { Either } from '@src/shared/logic/either';

import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export type RegisterUserResponse = Either<
  AccountAlreadyExistsError | InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
  IRegisteredUserDTO
>;
