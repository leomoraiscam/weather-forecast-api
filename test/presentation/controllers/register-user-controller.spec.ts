import { RegisterUserInput } from '@src/application/usecases/users/dtos/register-user-input';
import { AccountAlreadyExistsError } from '@src/application/usecases/users/errors/account-already-exists-error';
import { RegisterUserUseCase } from '@src/application/usecases/users/register-user/register-user-use-case';
import { RegisterUserController } from '@src/presentation/controllers/register-user-controller';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { left } from '@src/shared/core/either';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';

describe('RegisterUserWebController', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let registerUserUseCase: RegisterUserUseCase;
  let registerUserController: RegisterUserController;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    registerUserUseCase = new RegisterUserUseCase(inMemoryUserRepository);
    registerUserController = new RegisterUserController(registerUserUseCase);
  });

  it('should be able to return status code 201 when request contains valid user data', async () => {
    const request: IHttpRequest<RegisterUserInput> = {
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

  it('should be able to return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: IHttpRequest<RegisterUserInput> = {
      body: {
        name: 'A',
        email: 'wo@luhe.mr',
        password: '123456789',
      },
    };
    const response = await registerUserController.handle(requestWithInvalidName);

    expect(response.statusCode).toEqual(400);
  });

  it('should be able to return status code 400 when request contains invalid user email', async () => {
    const requestWithInvalidEmail: IHttpRequest<RegisterUserInput> = {
      body: {
        name: 'Cornelia Pena',
        email: 'wrongEmail.com',
        password: '123456789',
      },
    };
    const response = await registerUserController.handle(requestWithInvalidEmail);

    expect(response.statusCode).toEqual(400);
  });

  it('should be able to return status code 409 when user already exist', async () => {
    jest
      .spyOn(registerUserUseCase, 'execute')
      .mockResolvedValueOnce(left(new AccountAlreadyExistsError()));

    const request: IHttpRequest<RegisterUserInput> = {
      body: {
        name: 'Bradley May',
        email: 'za@lisop.gs',
        password: '123456789',
      },
    };
    const controller: RegisterUserController = new RegisterUserController(registerUserUseCase);
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(409);
  });

  it('should be able to return status code 500 when server raises', async () => {
    jest
      .spyOn(registerUserUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Unexpected server error'));

    const request: IHttpRequest<RegisterUserInput> = {
      body: {
        name: 'Bradley May',
        email: 'za@lisop.gs',
        password: '123456789',
      },
    };
    const controller: RegisterUserController = new RegisterUserController(registerUserUseCase);
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
