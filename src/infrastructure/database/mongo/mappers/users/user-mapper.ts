import { Email } from '@src/entities/user/email';
import { Name } from '@src/entities/user/name';
import { Password } from '@src/entities/user/password';
import { User } from '@src/entities/user/user';

export class UserMapper {
  static async toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      password: await user.password.getHashedValue(),
    };
  }

  static toDomain(raw): User {
    const nameOrError = Name.create(raw.name);
    const emailOrError = Email.create(raw.email);
    const passwordOrError = Password.create(raw.password, true);

    if (nameOrError.isLeft()) {
      throw new Error('Name value is invalid.');
    }

    if (emailOrError.isLeft()) {
      throw new Error('Email value is invalid.');
    }

    if (passwordOrError.isLeft()) {
      throw new Error('Password value is invalid.');
    }

    const userOrError = User.create(
      {
        name: nameOrError.value,
        email: emailOrError.value,
        password: passwordOrError.value,
      },
      raw.id,
    );

    if (userOrError.isRight()) {
      return userOrError.value;
    }

    return null;
  }
}
