import { AuthenticateUserUseCase } from '@src/application/usecases/users/authenticate-user/authenticate-user-use-case';
import { InMemoryTokenManagerProvider } from '@test/doubles/providers/token-manager/in-memory-token-manager-provider';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createUser } from '@test/factories/user-factory';

describe('AuthenticateUserUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryTokenManagerProvider: InMemoryTokenManagerProvider;
  let authenticateUserUseCase: AuthenticateUserUseCase;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryTokenManagerProvider = new InMemoryTokenManagerProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      inMemoryTokenManagerProvider,
    );
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
