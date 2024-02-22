import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryLoggerService } from '@src/external/logger-service/in-memory/in-memory-logger-service';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { InMemoryBeachRepository } from '@src/modules/forecast/repositories/in-memory/in-memory-beach-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import processForecastBeachesResponse from '@test/fixtures/process-forecast-beaches-response.json';
import { StormGlassServiceMock } from '@test/mocks/storm-glass-service-mock';
import { StormGlassServicerErrorStub } from '@test/stubs/storm-glass-service-error-stub';
import { StormGlassServiceStub } from '@test/stubs/storm-glass-service-stub';

import { StormGlassResponseError } from './errors/stormglass-response-error';
import { UserBeachForecastProcessingUseCase } from './user-beach-forecast-processing-use-case';

let inMemoryUsersRepository: InMemoryUserRepository;
let inMemoryBeachesRepository: InMemoryBeachRepository;
let inMemoryLoggerService: InMemoryLoggerService;

describe('Process Forecast For Beaches Use Case', () => {
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

    const response = await userBeachForecastProcessingUseCase.execute('any-user-id');

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

    const response = await userBeachForecastProcessingUseCase.execute('fake-user-id');

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

    const response = await userBeachForecastProcessingUseCase.execute('fake-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(StormGlassResponseError);
  });

  it('should return the forecast beaches in the same hour with different ratings', async () => {
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

    const beachesWithRating = await userBeachForecastProcessingUseCase.execute('fake-user-id');

    expect(beachesWithRating).toEqual({
      value: processForecastBeachesResponse,
    });
  });

  it.todo(
    'should return the forecast for multiple beaches in the same hour with different ratings',
  );
});
