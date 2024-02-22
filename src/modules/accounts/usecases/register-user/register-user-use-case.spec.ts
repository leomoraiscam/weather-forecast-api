import { createUser } from '@test/factories/user-factory';

import { InvalidEmailError } from '../../domain/user/errors/invalid-email-error';
import { InvalidNameError } from '../../domain/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '../../domain/user/errors/invalid-password-length-error';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { IUserRepository } from '../../repositories/user-repository';
import { RegisterUserUseCase } from './register-user-use-case';

let userRepository: IUserRepository;
let registerUserUseCase: RegisterUserUseCase;

describe('Register User Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUserUseCase = new RegisterUserUseCase(userRepository);
  });

  it('should be able to register new user when received correct data', async () => {
    const response = await registerUserUseCase.execute({
      name: 'Marvin Guerrero',
      email: 'muzewzo@vaduusi.cd',
      password: '123456',
    });

    expect(response.isRight()).toBeTruthy();
  });

  it('should not be able to register new user with name is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'J',
      email: 'jabwa@tabgud.ad',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should not be able to register new user with email is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'Madge May',
      email: 'john',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidEmailError);
  });

  it('should not be able to register new user with password is invalid', async () => {
    const response = await registerUserUseCase.execute({
      name: 'Nell Santos',
      email: 'edi@gati.mk',
      password: '123',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidPasswordLengthError);
  });

  it('should not be able to register new user with existing email', async () => {
    const user = createUser();

    await userRepository.create(user);

    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
