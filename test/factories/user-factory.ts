import { Email } from '../../src/modules/accounts/domain/user/email';
import { Name } from '../../src/modules/accounts/domain/user/name';
import { Password } from '../../src/modules/accounts/domain/user/password';
import { User } from '../../src/modules/accounts/domain/user/user';

type UserOverrides = {
  email?: string;
  password?: string;
};

export function createUser(overrides?: UserOverrides) {
  const name = Name.create('John Doe').value as Name;
  const email = Email.create(overrides?.email ?? 'john@doe.com').value as Email;
  const password = Password.create(overrides?.password ?? '123456').value as Password;

  const user = User.create(
    {
      name,
      email,
      password,
    },
    'fake-user-id',
  );

  return user.value as User;
}
