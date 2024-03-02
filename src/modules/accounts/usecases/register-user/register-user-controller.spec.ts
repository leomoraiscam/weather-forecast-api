import { IRegisterUserDTO } from '@src/modules/accounts/dtos/register-user';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { ErrorThrowingConflictUseCaseStub } from '@test/stubs/account-already-exists-error-stub';
import { ErrorThrowingUseCaseStub } from '@test/stubs/error-throwing-stub';

import { RegisterUserController } from './register-user-controller';
import { RegisterUserResponse } from './register-user-response';
import { RegisterUserUseCase } from './register-user-use-case';

let inMemoryUserRepository: InMemoryUserRepository;
let registerUserUseCase: RegisterUserUseCase;
const mockValidator = {
  validate: jest.fn().mockReturnValue({ isLeft: jest.fn().mockReturnValue(false) }),
};
let registerUserController: RegisterUserController;

describe('Register user web controller', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    registerUserUseCase = new RegisterUserUseCase(inMemoryUserRepository);
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
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub<
      IRegisterUserDTO,
      RegisterUserResponse
    >();

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
