import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { IUserRepository } from '@src/modules/accounts/repositories/user-repository';
import { createUser } from '@test/factories/user-factory';

import { AuthenticateUserUseCase } from './authenticate-user-use-case';

let usersRepository: IUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able return token property to user when the same is authenticate with success', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.value).toHaveProperty('token');
    expect(response.value).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  it('should not be able return token property to user when received incorrect email for existing user', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'invalid@example.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should not be able return token property to user when received incorrect password for existing user', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'john@doe.com',
      password: '123456789',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
