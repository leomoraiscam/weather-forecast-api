import { IAuthenticationUserDTO } from '@src/modules/accounts/dtos/authentication-user';
import { Either } from '@src/shared/core/either';

import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export type AuthenticateUserResponse = Either<InvalidEmailOrPasswordError, IAuthenticationUserDTO>;
