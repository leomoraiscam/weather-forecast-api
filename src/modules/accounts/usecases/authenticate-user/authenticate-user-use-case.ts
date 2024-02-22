import { Either, left, right } from '@src/shared/logic/either';

import { JWT } from '../../domain/user/jwt';
import { IAuthenticateUserDTO } from '../../dtos/authenticate-user';
import { IAuthenticationUserDTO } from '../../dtos/authentication-user';
import { IUserRepository } from '../../repositories/user-repository';
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error';

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateUserDTO): Promise<Either<InvalidEmailOrPasswordError, IAuthenticationUserDTO>> {
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