import { ITokenManagerProvider } from '@src/application/contracts/providers/token-manager-provider/token-manager-provider';
import { IUserRepository } from '@src/application/contracts/repositories/users/user-repository';
import { left, right } from '@src/shared/core/either';

import { AuthenticateUserInput } from '../dtos/authenticate-user-input';
import { InvalidEmailOrPasswordError } from '../errors/invalid-email-or-password-error';
import {
  IAuthenticateUser,
  AuthenticateUserResponse,
} from './contracts/authenticate-user-interface';

export class AuthenticateUserUseCase implements IAuthenticateUser {
  constructor(
    private userRepository: IUserRepository,
    private tokenManagerProvider: ITokenManagerProvider,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticateUserResponse> {
    const { email, password } = input;
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) {
      return left(new InvalidEmailOrPasswordError());
    }

    const isPasswordValid = await existingUser.password.comparePassword(password);

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError());
    }

    const { id } = existingUser;
    const token = await this.tokenManagerProvider.sign({ id });

    return right({ token });
  }
}
