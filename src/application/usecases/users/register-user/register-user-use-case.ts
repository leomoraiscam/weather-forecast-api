import { IUserRepository } from '@src/application/contracts/repositories/users/user-repository';
import { Email } from '@src/entities/user/email';
import { Name } from '@src/entities/user/name';
import { Password } from '@src/entities/user/password';
import { User } from '@src/entities/user/user';
import { left, right } from '@src/shared/logic/either';

import { RegisterUserInput } from '../dtos/register-user-input';
import { AccountAlreadyExistsError } from '../errors/account-already-exists-error';
import { IRegisterUser, RegisterUserResponse } from './contracts/register-user-interface';

export class RegisterUserUseCase implements IRegisterUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResponse> {
    const { name, email, password } = input;
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
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      return left(new AccountAlreadyExistsError());
    }

    await this.userRepository.create(user);

    return right({
      id: user.id,
      name: user.name.value,
      email: user.email.value,
    });
  }
}
