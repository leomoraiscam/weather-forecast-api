import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { IRegisterBeachDTO } from '@src/modules/forecast/dtos/register-beach';
import { InMemoryBeachRepository } from '@src/modules/forecast/repositories/in-memory/in-memory-beach-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { createUser } from '@test/factories/user-factory';
import { ErrorThrowingConflictUseCaseStub } from '@test/fixtures/stubs/beach-already-exists-error-stub';
import { ErrorThrowingUseCaseStub } from '@test/fixtures/stubs/error-throwing-stub';

import { RegisterBeachController } from './register-beach-controller';
import { RegisterBeachResponse } from './register-beach-response';
import { RegisterBeachUseCase } from './register-beach-use-case';

let inMemoryBeachRepository: InMemoryBeachRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let registerBeachUseCase: RegisterBeachUseCase;
let registerBeachController: RegisterBeachController;
let userId: string;
const mockValidator = {
  validate: jest.fn().mockReturnValue({ isLeft: jest.fn().mockReturnValue(false) }),
};

describe('Register beach web controller', () => {
  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    registerBeachUseCase = new RegisterBeachUseCase(
      inMemoryBeachRepository,
      inMemoryUserRepository,
    );
    registerBeachController = new RegisterBeachController(registerBeachUseCase, mockValidator);

    const user = createUser();
    await inMemoryUserRepository.create(user);

    userId = user.id;
  });

  it('should return status code 201 when request contains valid user data', async () => {
    const request: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };

    const response = await registerBeachController.handle(request);

    expect(response.statusCode).toEqual(201);
    expect(response.body).toHaveProperty('id');
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'D',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };

    const response = await registerBeachController.handle(requestWithInvalidName);

    expect(response.statusCode).toEqual(400);
  });

  it('should return status code 400 when request contains invalid position', async () => {
    const requestWithInvalidPosition: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: undefined,
      },
      userId,
    };

    const response = await registerBeachController.handle(requestWithInvalidPosition);

    expect(response.statusCode).toEqual(400);
  });

  it('should return status code 401 when request not contains userId', async () => {
    const request: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
    };

    const response = await registerBeachController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should return status code 409 when beach already exist', async () => {
    const errorThrowingConflictUseCaseStub = new ErrorThrowingConflictUseCaseStub();

    const request: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };

    const controller: RegisterBeachController = new RegisterBeachController(
      errorThrowingConflictUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(409);
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub<
      IRegisterBeachDTO,
      RegisterBeachResponse
    >();

    const request: IHttpRequest<IRegisterBeachDTO> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };

    const controller: RegisterBeachController = new RegisterBeachController(
      errorThrowingUseCaseStub,
      mockValidator,
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
