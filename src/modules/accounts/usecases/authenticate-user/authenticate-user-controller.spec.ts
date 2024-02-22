/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { IAuthenticateUserDTO } from '@src/modules/accounts/dtos/authenticate-user';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { Either, left } from '@src/shared/logic/either';
import { createUser } from '@test/factories/user-factory';

import { AuthenticateUserController } from './authenticate-user-controller';
import { AuthenticateUserUseCase } from './authenticate-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
const mockValidator = {
  validate: jest.fn().mockReturnValue({ isLeft: jest.fn().mockReturnValue(false) }),
};
let authenticateUserController: AuthenticateUserController;

export class ErrorThrowingUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    throw Error();
  }
}

export class ErrorThrowingConflictUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    // const error = new AccountAlreadyExistsError('any_email@email.com');

    return left('');
  }
}

export class ErrorDefaultThrowingUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    const error = new Error('Unexpected error occurred');

    return left(error);
  }
}

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
