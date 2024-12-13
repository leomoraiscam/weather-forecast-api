import { IUseCase } from '@src/main/adapters/ports/use-case';
import { JWT } from '@src/modules/accounts/domain/user/jwt';
import { IAuthenticateUserDTO } from '@src/modules/accounts/dtos/authenticate-user';
import { IUserRepository } from '@src/modules/accounts/repositories/ports/user-repository';
import { left, right } from '@src/shared/core/either';

import { AuthenticateUserResponse } from './authenticate-user-response';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export class AuthenticateUserUseCase
  implements IUseCase<IAuthenticateUserDTO, AuthenticateUserResponse>
{
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: IAuthenticateUserDTO): Promise<AuthenticateUserResponse> {
    const userExisted = await this.userRepository.findByEmail(email);

    if (!userExisted) {
      return left(new InvalidEmailOrPasswordError());
    }

    const isPasswordValid = await userExisted.password.comparePassword(password);

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError());
    }

    const { token } = JWT.signUser(userExisted);

    return right({ token });
  }
}
