/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */

import { InMemoryLoggerService } from '@src/external/logger-service/in-memory/in-memory-logger-service';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-users-repository';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { Either } from '@src/shared/logic/either';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import { StormGlassServiceMock } from '@test/mocks/storm-glass-service-mock';

import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { FetchPointsController } from './process-forecast-for-beaches-controller';
import { ProcessForecastBeachesUseCase } from './process-forecast-for-beaches-use-case';

let beachRepository: InMemoryBeachRepository;
let userRepository: InMemoryUserRepository;
let processForecastBeachesUseCase: ProcessForecastBeachesUseCase;
let inMemoryLoggerService: InMemoryLoggerService;
let stormGlassServiceMock: StormGlassServiceMock;
let fetchPointsController: FetchPointsController;
let userId: string;

export class ErrorThrowingUseCaseStub {
  async execute(_: any): Promise<Either<any, any>> {
    throw Error();
  }
}

describe('Fetch points beach web controller', () => {
  beforeEach(async () => {
    beachRepository = new InMemoryBeachRepository();
    userRepository = new InMemoryUserRepository();
    stormGlassServiceMock = new StormGlassServiceMock();
    inMemoryLoggerService = new InMemoryLoggerService();
    processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      stormGlassServiceMock,
      userRepository,
      beachRepository,
      inMemoryLoggerService,
    );
    fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

    const user = createUser();
    await userRepository.create(user);

    userId = user.id;

    const beach = createBeach({
      userId,
    });

    await beachRepository.create(beach);
  });

  it('should return status code 200 when request contains valid user data', async () => {
    const request: IHttpRequest<{ userId: string }> = {
      userId,
    };

    const response = await fetchPointsController.handle(request);

    expect(response.statusCode).toEqual(200);
  });

  it('should return status code 404 when user does not exist', async () => {
    const request: IHttpRequest<{ userId: string }> = {
      userId: 'id-non-exist',
    };

    const response = await fetchPointsController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should return status code 404 when user does not exist', async () => {
    const user = createUser({
      id: 'other-id',
    });
    await userRepository.create(user);

    const request: IHttpRequest<{ userId: string }> = {
      userId: user.id,
    };

    const response = await fetchPointsController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should return status code 500 when server raises', async () => {
    const errorThrowingUseCaseStub = new ErrorThrowingUseCaseStub();

    const request: IHttpRequest<{ userId: string }> = {
      userId,
    };

    const controller = new FetchPointsController(errorThrowingUseCaseStub);

    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
