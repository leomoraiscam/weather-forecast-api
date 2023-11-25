/* eslint-disable max-classes-per-file */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryUsersRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-users-repository';
import { createBeach } from '@test/factories/BeachFactory';
import { createUser } from '@test/factories/UserFactory';
import { FetchPointServiceMock } from '@test/mocks/fetch-point-service-mock';
import { FetchPointServiceErrorStub } from '@test/stubs/fetch-point-service-empty-stub';
import { FetchPointService } from '@test/stubs/fetch-point-service-stub';

import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { StormGlassResponseError } from './errors/stormglass-response-error';
import { ProcessForecastBeachesUseCase } from './process-forecast-for-beaches-use-case';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryBeachesRepository: InMemoryBeachRepository;

describe('Process Forecast For Beaches Use Case', () => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryBeachesRepository = new InMemoryBeachRepository();

  it('should not be able to return list the forecast of beaches array when user does not exist', async () => {
    const fetchPointServiceMock = new FetchPointServiceMock();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      fetchPointServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('any-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(fetchPointServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should not be able to return list the forecast of beaches array when user not has beaches', async () => {
    const user = createUser();

    inMemoryUsersRepository.create(user);

    const fetchPointServiceMock = new FetchPointServiceMock();
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      fetchPointServiceMock,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id');

    expect(response.isLeft()).toBeTruthy();
    expect(fetchPointServiceMock.timesSendWasCalled).toEqual(0);
  });

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const user = createUser();

    inMemoryUsersRepository.create(user);

    const beach = createBeach();

    inMemoryBeachesRepository.create(beach);

    const fetchPointServiceErrorStub = new FetchPointServiceErrorStub();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      fetchPointServiceErrorStub,
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

    const fetchPointService = new FetchPointService();

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      fetchPointService,
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
              lng: 141.289824,
              name: 'Dee Why',
              position: 'S',
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
