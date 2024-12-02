import { BeachPosition } from '@config/constants/beach-position-enum';
import { TimeGroupedBeachForecast } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/timed-grouped-beach-forecast';
import { GetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/get-user-beaches-forecast-use-case';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { InMemoryLoggerProvider } from '@test/doubles/providers/logger-provider/in-memory-logger-service';
import { InMemoryBeachRepository } from '@test/doubles/repositories/in-memory-beach-repository';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import processForecastBeachesResponse from '@test/fixtures/data/process-forecast-beaches-response.json';
import { StormGlassServiceMock } from '@test/fixtures/mocks/storm-glass-service-mock';
import { StormGlassServicerErrorStub } from '@test/fixtures/stubs/storm-glass-service-error-stub';
import { StormGlassServiceStub } from '@test/fixtures/stubs/storm-glass-service-stub';

describe('GetUserBeachesForecastUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryBeachRepository: InMemoryBeachRepository;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
  });

  it('should not be able to return list the forecast of beaches array when user does not exist', async () => {
    const stormGlassServiceMock = new StormGlassServiceMock();
    const userBeachForecastProcessingUseCase = new GetUserBeachesForecastUseCase(
      stormGlassServiceMock,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerProvider,
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
    inMemoryUserRepository.create(user);

    const stormGlassServiceMock = new StormGlassServiceMock();
    const userBeachForecastProcessingUseCase = new GetUserBeachesForecastUseCase(
      stormGlassServiceMock,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerProvider,
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
    inMemoryUserRepository.create(user);

    const beach = createBeach();
    inMemoryBeachRepository.create(beach);

    const stormGlassServicerErrorStub = new StormGlassServicerErrorStub();
    const userBeachForecastProcessingUseCase = new GetUserBeachesForecastUseCase(
      stormGlassServicerErrorStub,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerProvider,
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
    await inMemoryUserRepository.create(user);

    const manlyBeach = createBeach({
      name: 'Manly',
      lat: -33.796478,
      lng: 151.287648,
      position: BeachPosition.E,
    });
    inMemoryBeachRepository.create(manlyBeach);

    const stormGlassServiceStub = new StormGlassServiceStub();
    const userBeachForecastProcessingUseCase = new GetUserBeachesForecastUseCase(
      stormGlassServiceStub,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerProvider,
    );

    const beachesWithRating = (
      await userBeachForecastProcessingUseCase.execute({
        userId: 'fake-user-id',
        page: 1,
        pageSize: 5,
      })
    ).value as TimeGroupedBeachForecast[];

    expect(beachesWithRating).toEqual(processForecastBeachesResponse);
    expect(beachesWithRating.length).toEqual(5);
  });
});
