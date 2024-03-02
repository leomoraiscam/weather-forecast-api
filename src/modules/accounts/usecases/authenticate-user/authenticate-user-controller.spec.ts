/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { IAuthenticateUserDTO } from '@src/modules/accounts/dtos/authenticate-user';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { createUser } from '@test/factories/user-factory';
import { ErrorDefaultThrowingUseCaseStub } from '@test/stubs/default-error-throwing-stub';
import { ErrorThrowingUseCaseStub } from '@test/stubs/error-throwing-stub';

import { AuthenticateUserController } from './authenticate-user-controller';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
const mockValidator = {
  validate: jest.fn().mockReturnValue({ isLeft: jest.fn().mockReturnValue(false) }),
};
let authenticateUserController: AuthenticateUserController;

describe('Authenticate user web controller', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    authenticateUserController = new AuthenticateUserController(
      authenticateUserUseCase,
      mockValidator,
    );
  });

  it('should return status code 200 when request contains valid user data', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };

    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return status code 401 when user a non exist and receive data the same', async () => {
    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'hujeho@ocupa.so',
        password: '123456',
      },
    };

    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should return status code 401 when request contains invalid user email', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'wrong-email@email.com',
        password: '123456',
      },
    };

    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should return status code 401 when request contains invalid user password', async () => {
    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'john@doe.com',
        password: '1234986',
      },
    };

    const response = await authenticateUserController.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should return status code 401 when occurred an error a non mapped', async () => {
    const errorDefaultThrowingUseCaseStub = new ErrorDefaultThrowingUseCaseStub();

    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };

    const controller: AuthenticateUserController = new AuthenticateUserController(
      errorDefaultThrowingUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(401);
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub();

    const user = createUser();

    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IAuthenticateUserDTO> = {
      body: {
        email: 'john@doe.com',
        password: '123456',
      },
    };

    const controller: AuthenticateUserController = new AuthenticateUserController(
      errorThrowingUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
