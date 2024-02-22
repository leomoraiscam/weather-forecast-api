import { createUser } from '@test/factories/user-factory';

import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { IUserRepository } from '../../repositories/user-repository';
import { AuthenticateUser } from './authenticate-user';

let usersRepository: IUserRepository;
let authenticateUser: AuthenticateUser;

describe('Authenticate User Use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    authenticateUser = new AuthenticateUser(usersRepository);
  });

  it('should be able to authenticate', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await authenticateUser.execute({
      email: 'john@doe.com',
      password: '123456',
    });

    expect(response.value).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });

  it('should not be able to authenticate with invalid e-mail', async () => {
    const response = await authenticateUser.execute({
      email: 'invalid@example.com',
      password: '123456',
    });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should not be able to authenticate with invalid password', async () => {
    const user = createUser();

    usersRepository.create(user);

    const response = await authenticateUser.execute({
      email: 'john@doe.com',
      password: '123456789',
    });

    expect(response.isLeft()).toBeTruthy();
  });
});
