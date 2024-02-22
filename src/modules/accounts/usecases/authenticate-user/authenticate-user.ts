import { Either, left, right } from '@src/shared/logic/either';

import { JWT } from '../../domain/user/jwt';
import { IAuthenticateUserRequest } from '../../dtos/authenticate-user-request';
import { IAuthenticateUserResponse } from '../../dtos/authenticate-user-response';
import { IUserRepository } from '../../repositories/user-repository';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export class AuthenticateUser {
  constructor(private usersRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserRequest): Promise<
    Either<InvalidEmailOrPasswordError, IAuthenticateUserResponse>
  > {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidEmailOrPasswordError());
    }

    const isPasswordValid = await user.password.comparePassword(password);

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError());
    }

    const { token } = JWT.signUser(user);

    return right({ token });
  }
}
