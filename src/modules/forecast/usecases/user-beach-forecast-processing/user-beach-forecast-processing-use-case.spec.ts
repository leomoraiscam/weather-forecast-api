import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryLoggerService } from '@src/external/services/logger-service/in-memory/in-memory-logger-service';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { InMemoryBeachRepository } from '@src/modules/forecast/repositories/in-memory/in-memory-beach-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import processForecastBeachesResponse from '@test/fixtures/data/process-forecast-beaches-response.json';
import { StormGlassServiceMock } from '@test/fixtures/mocks/storm-glass-service-mock';
import { StormGlassServicerErrorStub } from '@test/fixtures/stubs/storm-glass-service-error-stub';
import { StormGlassServiceStub } from '@test/fixtures/stubs/storm-glass-service-stub';

import { ITimeBeachRatingForecastDTO } from '../../dtos/time-beach-rating-forecast';
import { StormGlassResponseError } from './errors/stormglass-response-error';
import { UserBeachForecastProcessingUseCase } from './user-beach-forecast-processing-use-case';

let inMemoryUsersRepository: InMemoryUserRepository;
let inMemoryBeachesRepository: InMemoryBeachRepository;
let inMemoryLoggerService: InMemoryLoggerService;

describe('User beach forecast processing use case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUserRepository();
    inMemoryBeachesRepository = new InMemoryBeachRepository();
    inMemoryLoggerService = new InMemoryLoggerService();
  });

  it('should not be able to return list the forecast of beaches array when user does not exist', async () => {
    const stormGlassServiceMock = new StormGlassServiceMock();
    const userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
      stormGlassServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
      inMemoryLoggerService,
    );

    const response = await userBeachForecastProcessingUseCase.execute({
      userId: 'any-user-id',
      page: 1,
      pageSize: 5,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(stormGlassServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should not be able to return list the forecast of beaches array when user exist but not has beaches', async () => {
    const user = createUser();

    inMemoryUsersRepository.create(user);

    const stormGlassServiceMock = new StormGlassServiceMock();
    const userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
      stormGlassServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
      inMemoryLoggerService,
    );

    const response = await userBeachForecastProcessingUseCase.execute({
      userId: 'fake-user-id',
      page: 1,
      pageSize: 5,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(stormGlassServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const user = createUser();
    inMemoryUsersRepository.create(user);

    const beach = createBeach();
    inMemoryBeachesRepository.create(beach);

    const stormGlassServicerErrorStub = new StormGlassServicerErrorStub();
    const userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
      stormGlassServicerErrorStub,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
      inMemoryLoggerService,
    );

    const response = await userBeachForecastProcessingUseCase.execute({
      userId: 'fake-user-id',
      page: 1,
      pageSize: 5,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(StormGlassResponseError);
  });

  it('should be able to return the forecast beaches in the same hour with different ratings', async () => {
    const user = createUser();
    await inMemoryUsersRepository.create(user);

    const manlyBeach = createBeach({
      name: 'Manly',
      lat: -33.796478,
      lng: 151.287648,
      position: BeachPosition.E,
    });
    inMemoryBeachesRepository.create(manlyBeach);

    const stormGlassServiceStub = new StormGlassServiceStub();
    const userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
      stormGlassServiceStub,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
      inMemoryLoggerService,
    );

    const beachesWithRating = (
      await userBeachForecastProcessingUseCase.execute({
        userId: 'fake-user-id',
        page: 1,
        pageSize: 5,
      })
    ).value as ITimeBeachRatingForecastDTO[];

    expect(beachesWithRating).toEqual(processForecastBeachesResponse);
    expect(beachesWithRating.length).toEqual(5);
  });
});
