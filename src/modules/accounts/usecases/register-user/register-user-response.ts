import { Either } from '@src/shared/logic/either';

import { InvalidEmailError } from '../../domain/user/errors/invalid-email-error';
import { InvalidNameError } from '../../domain/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '../../domain/user/errors/invalid-password-length-error';
import { IRegisteredUserDTO } from '../../dtos/registered-user';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export type RegisterUserResponse = Either<
  AccountAlreadyExistsError | InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
  IRegisteredUserDTO
>;
