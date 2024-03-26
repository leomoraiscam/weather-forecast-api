import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { createUser } from '@test/factories/user-factory';

import { AuthenticateUserUseCase } from './authenticate-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate user use case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
  });

  it('should be able to return token property to user when the same is authenticate with success', async () => {
    const user = createUser();

    inMemoryUserRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.value).toHaveProperty('token');
    expect(response.value).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  it('should not be able to return token property to user when received incorrect email for existing user', async () => {
    const user = createUser();

    inMemoryUserRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'invalid@example.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should not be able to return token property to user when received incorrect password for existing user', async () => {
    const user = createUser();

    inMemoryUserRepository.create(user);

    const response = await authenticateUserUseCase.execute({
      email: 'john@doe.com',
      password: '123456789',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
