import { createUser } from '@test/factories/UserFactory';

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
    expect(response.isRight).toBeTruthy();
  });

  it('should not be able to register new user with invalid data', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john',
      password: '123',
    });

    expect(response.isLeft).toBeTruthy();
  });

  it('should not be able to register new user with existing email', async () => {
    const user = createUser({
      email: 'john@doe.com',
    });

    usersRepository.create(user);

    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response.isLeft).toBeTruthy();
  });
});
