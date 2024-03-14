import { IUseCase } from '@src/main/adapters/ports/use-case';
import { Email } from '@src/modules/accounts/domain/user/email';
import { Name } from '@src/modules/accounts/domain/user/name';
import { Password } from '@src/modules/accounts/domain/user/password';
import { User } from '@src/modules/accounts/domain/user/user';
import { IRegisterUserDTO } from '@src/modules/accounts/dtos/register-user';
import { IUserRepository } from '@src/modules/accounts/repositories/ports/user-repository';
import { left, right } from '@src/shared/logic/either';

import { AccountAlreadyExistsError } from './errors/account-already-exists-error';
import { RegisterUserResponse } from './register-user-response';

export class RegisterUserUseCase implements IUseCase<IRegisterUserDTO, RegisterUserResponse> {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: IRegisterUserDTO): Promise<RegisterUserResponse> {
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

    const userExisted = await this.userRepository.findByEmail(user.email.value);

    if (userExisted) {
      return left(new AccountAlreadyExistsError(user.email.value));
    }

    await this.userRepository.create(user);

    return right({
      id: user.id,
      name: user.name.value,
      email: user.email.value,
    });
  }
}
