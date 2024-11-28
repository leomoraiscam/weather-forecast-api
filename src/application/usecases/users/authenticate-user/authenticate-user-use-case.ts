import { IUserRepository } from '@src/modules/accounts/repositories/ports/user-repository';
import { left, right } from '@src/shared/logic/either';

import { ITokenManagerProvider } from '../../../interfaces/providers/token-manager-provider';
import { AuthenticateUserInput } from './dtos/authenticate-user-input';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';
import {
  IAuthenticateUserInterface,
  AuthenticateUserResponse,
} from './interfaces/authenticate-user-interface';

export class AuthenticateUserUseCase implements IAuthenticateUserInterface {
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
