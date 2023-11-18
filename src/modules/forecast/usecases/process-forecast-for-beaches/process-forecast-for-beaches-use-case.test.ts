import stormGlassNormalizedResponse3Hours from '@test/fixtures/storm-glass-normalized-response-3-hours.json';
import processForecastBeachesResponse from '@test/fixtures/process-forecast-beaches-response.json';
import { ProcessForecastBeachesUseCase } from './process-forecast-for-beaches-use-case';
import { Beach as IBeach } from '../../dtos/beach';
import { BeachPosition } from '@config/constants/beach-position-enum';
import { Beach } from '@src/modules/forecast/domain/beach/beach';
import { Name } from '@src/modules/forecast/domain/beach/name';
import { Longitude } from '@src/modules/forecast/domain/beach/longitude';
import { Latitude } from '@src/modules/forecast/domain/beach/latitude';
import { Position } from '@src/modules/forecast/domain/beach/position';
import { FetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { Either, left, right } from '@src/shared/logic/Either';
import { StormGlassService } from '@src/external/stormglass-service/ports/stormglass-service';
import { FetchPointCoordinate } from '@src/external/stormglass-service/dtos/fetch-point-coordinate';
import { StormGlassResponseError } from './errors/stormglass-response-error';

export class FetchPointService implements StormGlassService {
  public async execute(
    _: FetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, FetchPointNormalize[]>> {
    return right(stormGlassNormalizedResponse3Hours);
  }
}

export class FetchPointServiceEmpty implements StormGlassService {
  public async execute(
    _: FetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, FetchPointNormalize[]>> {
    return right([]);
  }
}

export class FetchPointServiceError implements StormGlassService {
  public async execute(
    _: FetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, FetchPointNormalize[]>> {
    return left(new StormGlassResponseError('Error fetching data'));
  }
}

describe('Forecast Service', () => {
  let beach;
  let serializedBeach: IBeach[];

  const mockedSuccessResponseStormGlassService = new FetchPointService();
  const mockedSuccessEmptyResponseStormGlassService = new FetchPointServiceEmpty();
  const mockedErrorResponseStormGlassService = new FetchPointServiceError();

  beforeEach(() => {
    const name = Name.create('Dee Why').value as Name;
    const lat = Latitude.create(-33.792726).value as Latitude;
    const lng = Longitude.create(151.289824).value as Longitude;
    const position = Position.create(BeachPosition.E).value as Position;

    beach = Beach.create({
      name,
      lat,
      lng,
      position,
    }).value as Beach;

    serializedBeach = [
      {
        lat: beach.lat.value,
        lng: beach.lng.value,
        name: beach.name.value,
        position: beach.position.value as BeachPosition,
      },
    ];
  });

  it('should be able return the forecast for a list of beaches', async () => {
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedSuccessResponseStormGlassService,
    );

    const beachesWithRating = await processForecastBeachesUseCase.execute(serializedBeach);

    expect(beachesWithRating).toEqual({
      value: processForecastBeachesResponse,
    });
  });

  it('should be able to return an empty list the beaches array is empty', async () => {
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedSuccessEmptyResponseStormGlassService,
    );

    const response = await processForecastBeachesUseCase.execute([]);

    expect(response).toEqual({
      value: [],
    });
  });

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
      mockedErrorResponseStormGlassService,
    );

    const response = await processForecastBeachesUseCase.execute(serializedBeach);

    expect(response.isLeft()).toBeTruthy();
  });
});
