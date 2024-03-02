import { Either } from '@src/shared/logic/either';

import { IAuthenticationUserDTO } from '../../dtos/authentication-user';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export type AuthenticateUserResponse = Either<InvalidEmailOrPasswordError, IAuthenticationUserDTO>;
