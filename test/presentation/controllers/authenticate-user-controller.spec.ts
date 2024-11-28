import { AuthenticateUserUseCase } from '@src/application/usecases/users/authenticate-user/authenticate-user-use-case';
import { AuthenticateUserInput } from '@src/application/usecases/users/authenticate-user/dtos/authenticate-user-input';
import { AuthenticateUserController } from '@src/presentation/controllers/authenticate-user-controller';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { left } from '@src/shared/logic/either';
import { InMemoryTokenManagerProvider } from '@test/doubles/providers/token-manager/in-memory-token-manager-provider';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createUser } from '@test/factories/user-factory';

describe('AuthenticateUserWebController', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryTokenManagerProvider: InMemoryTokenManagerProvider;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let authenticateUserController: AuthenticateUserController;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryTokenManagerProvider = new InMemoryTokenManagerProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      inMemoryTokenManagerProvider,
    );
    authenticateUserController = new AuthenticateUserController(authenticateUserUseCase);
  });

  it('should be able to return status code 200 when request contains valid user data', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };
    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should be able to return status code 401 when user a non exist and receive data the same', async () => {
    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'hujeho@ocupa.so',
        password: '123456',
      },
    };
    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should be able to return status code 401 when request contains invalid user email', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'wrong-email@email.com',
        password: '123456',
      },
    };
    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should be able to return status code 401 when request contains invalid user password', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'john@doe.com',
        password: '1234986',
      },
    };
    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should be able to return status code 400 when occurred an error a non mapped', async () => {
    jest
      .spyOn(authenticateUserUseCase, 'execute')
      .mockResolvedValueOnce(left(new Error('Generic error')));

    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };
    const controller: AuthenticateUserController = new AuthenticateUserController(
      authenticateUserUseCase,
    );
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(400);
  });

  it('should be able to return status code 500 when server raises', async () => {
    jest
      .spyOn(authenticateUserUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Unexpected server error'));

    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<AuthenticateUserInput> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };
    const controller: AuthenticateUserController = new AuthenticateUserController(
      authenticateUserUseCase,
    );
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
