/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { Either, left } from '@src/shared/logic/either';

import { IRegisterUserDTO } from '../../dtos/register-user';
import { InMemoryUserRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { AccountAlreadyExistsError } from './errors/account-already-exists-error';
import { RegisterUserController } from './register-user-controller';
import { RegisterUserUseCase } from './register-user-use-case';

let userRepository: InMemoryUserRepository;
let registerUserUseCase: RegisterUserUseCase;
const mockValidator = {
  validate: jest.fn().mockReturnValue({ isLeft: jest.fn().mockReturnValue(false) }),
};
let registerUserController: RegisterUserController;

export class ErrorThrowingUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    throw Error();
  }
}

export class ErrorThrowingConflictUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    const error = new AccountAlreadyExistsError('any_email@email.com');

    return left(error);
  }
}

describe('Register user web controller', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository();
    registerUserUseCase = new RegisterUserUseCase(userRepository);
    registerUserController = new RegisterUserController(registerUserUseCase, mockValidator);
  });

  it('should return status code 201 when request contains valid user data', async () => {
    const request: IHttpRequest<IRegisterUserDTO> = {
      body: {
        name: 'Evan Nelson',
        email: 'zarmuov@etedo.vn',
        password: '123456789',
      },
    };

    const response = await registerUserController.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      }),
    );
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: IHttpRequest<IRegisterUserDTO> = {
      body: {
        name: 'A',
        email: 'wo@luhe.mr',
        password: '123456789',
      },
    };

    const response = await registerUserController.handle(requestWithInvalidName);

    expect(response.statusCode).toEqual(400);
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: IHttpRequest<IRegisterUserDTO> = {
      body: {
        name: 'Cornelia Pena',
        email: 'wrongEmail.com',
        password: '123456789',
      },
    };

    const response = await registerUserController.handle(requestWithInvalidEmail);

    expect(response.statusCode).toEqual(400);
  });

  it('should return status code 409 when user already exist', async () => {
    const errorThrowingConflictUseCaseStub = new ErrorThrowingConflictUseCaseStub();

    const request: IHttpRequest<IRegisterUserDTO> = {
      body: {
        name: 'Bradley May',
        email: 'za@lisop.gs',
        password: '123456789',
      },
    };

    const controller: RegisterUserController = new RegisterUserController(
      errorThrowingConflictUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(409);
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub();

    const request: IHttpRequest<IRegisterUserDTO> = {
      body: {
        name: 'Bradley May',
        email: 'za@lisop.gs',
        password: '123456789',
      },
    };

    const controller: RegisterUserController = new RegisterUserController(
      errorThrowingUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
