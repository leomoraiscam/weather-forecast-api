import { createUser } from '@test/factories/user-factory';

import { InvalidEmailError } from '../../domain/user/errors/invalid-email-error';
import { InvalidNameError } from '../../domain/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '../../domain/user/errors/invalid-password-length-error';
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '../../repositories/users-repository';
import { RegisterUserUseCase } from './register-user-use-case';

let usersRepository: IUsersRepository;
let registerUserUseCase: RegisterUserUseCase;

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUserUseCase = new RegisterUserUseCase(usersRepository);
  });

  it('should be able to register new user', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(await usersRepository.findByEmail('john@doe.com')).toBeTruthy();
    expect(response.isRight()).toBeTruthy();
  });

  it('should not be able to register new user with name is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'J',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should not be able to register new user with email is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });

  it('should not be able to register new user with password is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidPasswordLengthError);
  });

  it('should not be able to register new user with existing email', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
