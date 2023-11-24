import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left, right } from '@src/shared/logic/Either';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';
import { IStormGlassForecastResponse } from '../dtos/stormglass-response';
import { StormGlassMapper } from '../mapper/stormglass-mapper';
import { IStormGlassService } from '../ports/stormglass-service';
import { IRequestProvider } from '../providers/models/request-provider';

export class FetchPointService implements IStormGlassService {
  constructor(private requestProvider: IRequestProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({
    lat,
    lng,
  }: IFetchPointCoordinate): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    try {
      const response = await this.requestProvider.get<IStormGlassForecastResponse>({
        url: `${process.env.STORM_GLASS_API_URL}/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`,
        config: {
          headers: {
            Authorization: process.env.STORM_GLASS_API_KEY,
          },
        },
      });

      return right(StormGlassMapper.toNormalize(response.data));
    } catch (err) {
      return left(
        new StormGlassResponseError(
          `${JSON.stringify(err.response.data)} Code: ${err.response.status}`,
        ),
      );
    }
  }
}
