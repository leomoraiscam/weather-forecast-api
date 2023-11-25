/* eslint-disable max-classes-per-file */
import { BeachPosition } from '@config/constants/beach-position-enum';
import { IFetchPointCoordinate } from '@src/external/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '@src/external/stormglass-service/ports/stormglass-service';
import { Email } from '@src/modules/accounts/domain/user/email';
import { Name as UserDomainName } from '@src/modules/accounts/domain/user/name';
import { Password } from '@src/modules/accounts/domain/user/password';
import { User } from '@src/modules/accounts/domain/user/user';
import { InMemoryUsersRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-users-repository';
import { Beach } from '@src/modules/forecast/domain/beach/beach';
import { Latitude } from '@src/modules/forecast/domain/beach/latitude';
import { Longitude } from '@src/modules/forecast/domain/beach/longitude';
import { Name } from '@src/modules/forecast/domain/beach/name';
import { Position } from '@src/modules/forecast/domain/beach/position';
import { Either, left, right } from '@src/shared/logic/Either';
import fetchPointsNormalizedResponse from '@test/fixtures/fetch-points-normalized-response.json';

import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { StormGlassResponseError } from './errors/stormglass-response-error';
import { ProcessForecastBeachesUseCase } from './process-forecast-for-beaches-use-case';

export class FetchPointService implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right(fetchPointsNormalizedResponse);
  }
}

export class FetchPointService02 implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right([]);
  }
}

export class FetchPointServiceEmpty implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right([]);
  }
}

export class FetchPointServiceError implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return left(new StormGlassResponseError('Error fetching data'));
  }
}

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryBeachesRepository: InMemoryBeachRepository;

describe('Forecast Service', () => {
  const mockedSuccessResponseStormGlassService02 = new FetchPointService02();
  const mockedSuccessEmptyResponseStormGlassService = new FetchPointServiceEmpty();
  const mockedErrorResponseStormGlassService = new FetchPointServiceError();

  inMemoryUsersRepository = new InMemoryUsersRepository();
  inMemoryBeachesRepository = new InMemoryBeachRepository();

  it('should not be able to return list the beaches array when user does not exist', async () => {
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedSuccessEmptyResponseStormGlassService,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id-2');

    expect(response.isLeft()).toBeTruthy();
  });

  it('should not be able to return list the beaches array when user not has beaches', async () => {
    const name = UserDomainName.create('John Doe').value as UserDomainName;
    const email = Email.create('johndoe@example.com').value as Email;
    const password = Password.create('123456').value as Password;

    const user = User.create(
      {
        name,
        email,
        password,
      },
      'fake-user-id',
    ).value as User;

    inMemoryUsersRepository.create(user);

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedSuccessEmptyResponseStormGlassService,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id-2');

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedErrorResponseStormGlassService,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const response = await processForecastBeachesUseCase.execute('fake-user-id3');

    expect(response.isLeft()).toBeTruthy();
  });

  it('should return the forecast for mutiple beaches in the same hour with different ratings', async () => {
    const name01 = Name.create('Manly').value as Name;
    const lat01 = Latitude.create(-33.792726).value as Latitude;
    const lng01 = Longitude.create(151.289824).value as Longitude;
    const position01 = Position.create(BeachPosition.E).value as Position;

    const name02 = Name.create('Dee Why').value as Name;
    const lat02 = Latitude.create(-33.792726).value as Latitude;
    const lng02 = Longitude.create(141.289824).value as Longitude;
    const position02 = Position.create(BeachPosition.S).value as Position;

    const name = UserDomainName.create('John Doe').value as UserDomainName;
    const email = Email.create('johndoe@example.com').value as Email;
    const password = Password.create('123456').value as Password;

    const beach = Beach.create({
      name: name01,
      lat: lat01,
      lng: lng01,
      position: position01,
      userId: 'fake-user-id',
    }).value as Beach;

    const beach02 = Beach.create({
      name: name02,
      lat: lat02,
      lng: lng02,
      position: position02,
      userId: 'fake-user-id',
    }).value as Beach;

    await inMemoryBeachesRepository.create(beach);
    await inMemoryBeachesRepository.create(beach02);

    const user = User.create(
      {
        name,
        email,
        password,
      },
      'fake-user-id',
    ).value as User;

    inMemoryUsersRepository.create(user);

    jest.spyOn(mockedSuccessResponseStormGlassService02, 'execute').mockResolvedValueOnce(
      right([
        {
          swellDirection: 123.41,
          swellHeight: 0.21,
          swellPeriod: 3.67,
          time: '2020-04-26T00:00:00+00:00',
          waveDirection: 232.12,
          waveHeight: 0.46,
          windDirection: 310.48,
          windSpeed: 100,
        },
      ]),
    );

    jest.spyOn(mockedSuccessResponseStormGlassService02, 'execute').mockResolvedValueOnce(
      right([
        {
          swellDirection: 64.26,
          swellHeight: 0.15,
          swellPeriod: 13.89,
          time: '2020-04-26T00:00:00+00:00',
          waveDirection: 231.38,
          waveHeight: 2.07,
          windDirection: 299.45,
          windSpeed: 100,
        },
      ]),
    );

    const expectedResponse = [
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
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'S',
            rating: 3,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 13.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 2.07,
            windDirection: 299.45,
            windSpeed: 100,
          },
        ],
      },
    ];

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedSuccessResponseStormGlassService02,
      inMemoryUsersRepository,
      inMemoryBeachesRepository,
    );

    const beachesWithRating = await processForecastBeachesUseCase.execute('fake-user-id');

    expect(beachesWithRating).toEqual({
      value: expectedResponse,
    });
  });
});
