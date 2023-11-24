/* eslint-disable no-useless-constructor */
import { Either, left, right } from '@src/shared/logic/Either';

import { Email } from '../../domain/user/email';
import { InvalidEmailError } from '../../domain/user/errors/invalid-email-error';
import { InvalidNameError } from '../../domain/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '../../domain/user/errors/invalid-password-length-error';
import { Name } from '../../domain/user/name';
import { Password } from '../../domain/user/password';
import { User } from '../../domain/user/user';
import { IRegisterUserRequest } from '../../dtos/register-user-request';
import { IRegisterUser } from '../../dtos/register-user-response';
import { IUsersRepository } from '../../repositories/users-repository';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterUserRequest): Promise<
    Either<
      AccountAlreadyExistsError | InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
      IRegisterUser
    >
  > {
    const nameOrError = Name.create(name);
    const emailOrError = Email.create(email);
    const passwordOrError = Password.create(password);

    if (nameOrError.isLeft()) {
      return left(nameOrError.value);
    }

    if (emailOrError.isLeft()) {
      return left(emailOrError.value);
    }

    if (passwordOrError.isLeft()) {
      return left(passwordOrError.value);
    }

    const userOrError = User.create({
      name: nameOrError.value,
      email: emailOrError.value,
      password: passwordOrError.value,
    });

    if (userOrError.isLeft()) {
      return left(userOrError.value);
    }

    const user = userOrError.value;

    const userAlreadyExists = await this.usersRepository.findByEmail(user.email.value);

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value));
    }

    await this.usersRepository.create(user);

    return right({
      id: user.id,
      name: user.name.value,
      email: user.email.value,
    });
  }
}
