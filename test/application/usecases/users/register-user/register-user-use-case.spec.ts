import { RegisterUserUseCase } from '@src/application/usecases/users/register-user/register-user-use-case';
import { InvalidEmailError } from '@src/entities/user/errors/invalid-email-error';
import { InvalidNameError } from '@src/entities/user/errors/invalid-name-error';
import { InvalidPasswordLengthError } from '@src/entities/user/errors/invalid-password-length-error';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createUser } from '@test/factories/user-factory';

describe('RegisterUserUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let registerUserUseCase: RegisterUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    registerUserUseCase = new RegisterUserUseCase(inMemoryUserRepository);
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

    await inMemoryUserRepository.create(user);

    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
