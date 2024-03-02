/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { InMemoryLoggerService } from '@src/external/logger-service/in-memory/in-memory-logger-service';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { InMemoryBeachRepository } from '@src/modules/forecast/repositories/in-memory/in-memory-beach-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import { StormGlassServiceMock } from '@test/mocks/storm-glass-service-mock';
import { ErrorThrowingUseCaseStub } from '@test/stubs/error-throwing-stub';

import { UserBeachForecastProcessingController } from './user-beach-forecast-processing-controller';
import { UserBeachForecastProcessingUseCase } from './user-beach-forecast-processing-use-case';

let inMemoryBeachRepository: InMemoryBeachRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryLoggerService: InMemoryLoggerService;
let stormGlassServiceMock: StormGlassServiceMock;
let userBeachForecastProcessingController: UserBeachForecastProcessingController;
let userBeachForecastProcessingUseCase: UserBeachForecastProcessingUseCase;
let userId: string;

describe('Fetch points beach web controller', () => {
  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLoggerService = new InMemoryLoggerService();
    stormGlassServiceMock = new StormGlassServiceMock();
    userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
      stormGlassServiceMock,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerService,
    );
    userBeachForecastProcessingController = new UserBeachForecastProcessingController(
      userBeachForecastProcessingUseCase,
    );

    const user = createUser();
    await inMemoryUserRepository.create(user);

    userId = user.id;

    const beach = createBeach({
      userId,
    });

    await inMemoryBeachRepository.create(beach);
  });

  it('should return status code 200 when request contains valid user data', async () => {
    const request: IHttpRequest<{ userId: string }> = {
      userId,
    };

    const response = await userBeachForecastProcessingController.handle(request);

    expect(response.statusCode).toEqual(200);
  });

  it('should return status code 404 when user does not exist', async () => {
    const request: IHttpRequest<{ userId: string }> = {
      userId: 'id-non-exist',
    };

    const response = await userBeachForecastProcessingController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should return status code 404 when user does not exist', async () => {
    const user = createUser({
      id: 'other-id',
    });
    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<{ userId: string }> = {
      userId: user.id,
    };

    const response = await userBeachForecastProcessingController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub();

    const request: IHttpRequest<{ userId: string }> = {
      userId,
    };

    const controller = new UserBeachForecastProcessingController(errorThrowingUseCaseStub);

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
