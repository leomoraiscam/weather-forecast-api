import { Email } from '@src/entities/user/email';
import { Name } from '@src/entities/user/name';
import { Password } from '@src/entities/user/password';
import { User } from '@src/entities/user/user';

type UserOverrides = {
  id?: string;
  email?: string;
  password?: string;
  isHashed?: boolean;
};

export function createUser(overrides?: UserOverrides) {
  const id = overrides?.id ?? 'fake-user-id';
  const name = Name.create('John Doe').value as Name;
  const email = Email.create(overrides?.email ?? 'john@doe.com').value as Email;
  const password = Password.create(overrides?.password ?? '123456', overrides?.isHashed ?? false)
    .value as Password;

  const user = User.create(
    {
      name,
      email,
      password,
    },
    id,
  );

  return user.value as User;
}
