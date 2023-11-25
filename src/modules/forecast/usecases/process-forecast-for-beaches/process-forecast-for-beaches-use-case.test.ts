/* eslint-disable max-classes-per-file */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryUsersRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-users-repository';
import { createBeach } from '@test/factories/BeachFactory';
import { createUser } from '@test/factories/UserFactory';
import { StormGlassServiceMock } from '@test/mocks/storm-glass-service-mock';
import { StormGlassServiceStub } from '@test/stubs/storm-glass-service-stub';
import { StormGlassServicerErrorStub } from '@test/stubs/storn-glass-service-error-stub';

import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { StormGlassResponseError } from './errors/stormglass-response-error';
import { ProcessForecastBeachesUseCase } from './process-forecast-for-beaches-use-case';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryBeachesRepository: InMemoryBeachRepository;

describe('Process Forecast For Beaches Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryBeachesRepository = new InMemoryBeachRepository();
  });

  it('should not be able to return list the forecast of beaches array when user does not exist', async () => {
    const stormGlassServiceMock = new StormGlassServiceMock();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      stormGlassServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('any-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(stormGlassServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should not be able to return list the forecast of beaches array when user not has beaches', async () => {
    const user = createUser();

    inMemoryUsersRepository.create(user);

    const stormGlassServiceMock = new StormGlassServiceMock();
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      stormGlassServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(stormGlassServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const user = createUser();

    inMemoryUsersRepository.create(user);

    const beach = createBeach();

    inMemoryBeachesRepository.create(beach);

    const stormGlassServicerErrorStub = new StormGlassServicerErrorStub();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      stormGlassServicerErrorStub,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(StormGlassResponseError);
  });

  it('should return the forecast beaches in the same hour with different ratings', async () => {
    const user = createUser();

    await inMemoryUsersRepository.create(user);

    const manlyBeach = createBeach({
      name: 'Manly',
      lat: -33.792726,
      lng: 151.289824,
      position: BeachPosition.E,
    });

    inMemoryBeachesRepository.create(manlyBeach);

    const stormGlassServiceStub = new StormGlassServiceStub();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      stormGlassServiceStub,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const beachesWithRating = await processForecastBeachesUseCase.execute('fake-user-id');

    expect(beachesWithRating).toEqual({
      value: [
        {
          time: '2020-04-26T00:00:00+00:00',
          forecast: [
            {
              lat: -33.792726,
              lng: 151.289824,
              name: 'Manly',
              position: 'E',
              rating: 2,
              swellDirection: 123.41,
              swellHeight: 0.21,
              swellPeriod: 3.67,
              time: '2020-04-26T00:00:00+00:00',
              waveDirection: 232.12,
              waveHeight: 0.46,
              windDirection: 310.48,
              windSpeed: 100,
            },
          ],
        },
      ],
    });
  });

  it.todo('should return the forecast for mutiple beaches in the same hour with different ratings');
});
