import { Either } from '@src/shared/core/either';

import { AuthenticateUserInput } from '../../dtos/authenticate-user-input';
import { AuthenticateUserOutput } from '../../dtos/authenticate-user-output';
import { InvalidEmailOrPasswordError } from '../../errors/invalid-email-or-password-error';

export type AuthenticateUserResponse = Either<InvalidEmailOrPasswordError, AuthenticateUserOutput>;
export interface IAuthenticateUserUseCase {
  execute: (authenticateUserInput: AuthenticateUserInput) => Promise<AuthenticateUserResponse>;
}
