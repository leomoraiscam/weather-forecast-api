import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { RegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/register-beach-use-case';
import { IController } from '@src/presentation/contracts/controller';
import { IHttpRequest } from '@src/presentation/contracts/http-request';
import { RegisterBeachController } from '@src/presentation/controllers/register-beach-controller';
import { WebController } from '@src/presentation/controllers/web-controller';
import { BeachPosition } from '@src/shared/enums/beach-position-enum';
import { InMemoryCacheProvider } from '@test/doubles/providers/cache-provider/in-memory-cache-provider';
import { InMemoryBeachRepository } from '@test/doubles/repositories/in-memory-beach-repository';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createUser } from '@test/factories/user-factory';
import { ErrorThrowingConflictUseCaseStub } from '@test/fixtures/stubs/beach-already-exists-error-stub';

describe('RegisterBeachWebController', () => {
  let inMemoryBeachRepository: InMemoryBeachRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryCacheProvider: InMemoryCacheProvider;
  let registerBeachUseCase: RegisterBeachUseCase;
  let registerBeachController: IController;
  let userId: string;

  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryCacheProvider = new InMemoryCacheProvider();
    registerBeachUseCase = new RegisterBeachUseCase(
      inMemoryBeachRepository,
      inMemoryUserRepository,
      inMemoryCacheProvider,
    );
    registerBeachController = new WebController(new RegisterBeachController(registerBeachUseCase));

    const user = createUser();
    await inMemoryUserRepository.create(user);

    userId = user.id;
  });

  it('should be able to return status code 201 when request contains valid user data', async () => {
    const request: IHttpRequest<RegisterBeachInput> = {
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

  it('should be able to return status code 400 when request has missing field', async () => {
    const requestWithOutPositionProperty: IHttpRequest<RegisterBeachInput> = {
      body: {
        name: 'D',
        lat: -33.750919,
        lng: 151.299059,
      } as unknown as RegisterBeachInput,
      userId,
    };
    const response = await registerBeachController.handle(requestWithOutPositionProperty);

    expect(response.statusCode).toEqual(400);
  });

  it('should be able to return status code 400 when request contains invalid user name', async () => {
    const requestWithInvalidName: IHttpRequest<RegisterBeachInput> = {
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

  it('should be able to return status code 400 when request contains invalid position', async () => {
    const requestWithInvalidPosition: IHttpRequest<RegisterBeachInput> = {
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

  it('should be able to return status code 401 when request not contains userId', async () => {
    const request: IHttpRequest<RegisterBeachInput> = {
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

  it('should be able to return status code 409 when beach already exist', async () => {
    const errorThrowingConflictUseCaseStub = new ErrorThrowingConflictUseCaseStub();
    const request: IHttpRequest<RegisterBeachInput> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };
    const controller = new WebController(
      new RegisterBeachController(errorThrowingConflictUseCaseStub),
    );

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(409);
  });

  it('should be able to return status code 500 when server raises', async () => {
    jest
      .spyOn(registerBeachUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Unexpected server error'));
    const request: IHttpRequest<RegisterBeachInput> = {
      body: {
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      },
      userId,
    };
    const controller = new WebController(new RegisterBeachController(registerBeachUseCase));
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
