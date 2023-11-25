import { IFetchPointCoordinate } from '../../src/external/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../../src/external/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '../../src/external/stormglass-service/ports/stormglass-service';
import { StormGlassResponseError } from '../../src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, right } from '../../src/shared/logic/Either';

export class FetchPointService implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right([
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
    ]);
  }
}
