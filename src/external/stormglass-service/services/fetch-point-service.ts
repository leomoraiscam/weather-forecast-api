import { ICacheProvider } from '@src/external/cache-service/models/cache-provider';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left, right } from '@src/shared/logic/Either';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';
import { IStormGlassForecastResponse } from '../dtos/stormglass-response';
import { StormGlassMapper } from '../mapper/stormglass-mapper';
import { IStormGlassService } from '../ports/stormglass-service';
import { IRequestProvider } from '../providers/models/request-provider';

export class FetchPointService implements IStormGlassService {
  constructor(private requestProvider: IRequestProvider, private cacheProvider: ICacheProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({
    lat,
    lng,
    userId,
  }: IFetchPointCoordinate): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    try {
      const cacheKey = `provider-forecast-point: ${userId}:${lat}-${lng}`;

      const wavesPoints = await this.cacheProvider.recover<IFetchPointNormalize[]>(cacheKey);

      if (!wavesPoints) {
        const response = await this.requestProvider.get<IStormGlassForecastResponse>({
          url: `${process.env.STORM_GLASS_API_URL}/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`,
          config: {
            headers: {
              Authorization: process.env.STORM_GLASS_API_KEY,
            },
          },
        });

        const normalizeStormGlassData = StormGlassMapper.toNormalize(response.data);

        await this.cacheProvider.save(cacheKey, normalizeStormGlassData);

        return right(normalizeStormGlassData);
      }

      return right(wavesPoints);
    } catch (err) {
      return left(
        new StormGlassResponseError(
          `${JSON.stringify(err.response.data)} Code: ${err.response.status}`,
        ),
      );
    }
  }
}
