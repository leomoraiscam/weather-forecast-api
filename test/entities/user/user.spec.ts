import { Email } from '@src/entities/user/email';
import { Name } from '@src/entities/user/name';
import { Password } from '@src/entities/user/password';
import { User } from '@src/entities/user/user';

const name = Name.create('John Doe').value as Name;
const email = Email.create('johndoe@example.com').value as Email;
const password = Password.create('123456').value as Password;

describe('User domain entity', () => {
  it('should be able to create new user', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    });

    expect(userOrError.isRight()).toBeTruthy();
  });
});
