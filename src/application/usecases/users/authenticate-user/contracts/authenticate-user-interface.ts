import { Either } from '@src/shared/logic/either';

import { AuthenticateUserInput } from '../../dtos/authenticate-user-input';
import { AuthenticateUserOutput } from '../../dtos/authenticate-user-output';
import { InvalidEmailOrPasswordError } from '../../errors/invalid-email-or-password-error';

export type AuthenticateUserResponse = Either<InvalidEmailOrPasswordError, AuthenticateUserOutput>;
export interface IAuthenticateUser {
  execute: (authenticateUserInput: AuthenticateUserInput) => Promise<AuthenticateUserResponse>;
}
