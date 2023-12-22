import { TypesLogger } from '@config/constants/types-logger-enum';
import { ICacheProvider } from '@src/external/cache-service/ports/cache-provider';
import { IRequestProvider } from '@src/external/http-service/ports/request-provider';
import { ILoggerService } from '@src/external/logger-service/ports/logger-service';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left, right } from '@src/shared/logic/either';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';
import { IStormGlassForecastResponse } from '../dtos/stormglass-response';
import { StormGlassMapper } from '../mapper/stormglass-mapper';
import { IStormGlassService } from '../ports/stormglass-service';

export class FetchPointService implements IStormGlassService {
  constructor(
    private requestProvider: IRequestProvider,
    private cacheProvider: ICacheProvider,
    private loggerService: ILoggerService,
  ) {}

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
        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} starting call the stormglass API`,
          metadata: {
            lat,
            lng,
            userId,
          },
        });

        const response = await this.requestProvider.get<IStormGlassForecastResponse>({
          url: `${process.env.STORM_GLASS_API_URL}/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${lng}`,
          config: {
            headers: {
              Authorization: process.env.STORM_GLASS_API_KEY,
            },
          },
        });

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} - Stormglass API response call finished with success`,
        });

        const normalizeStormGlassData = StormGlassMapper.toNormalize(response.data);

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} call StormGlassMapper to normalize the response successfully`,
        });

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} Initializing data persistence in the cache`,
        });

        await this.cacheProvider.save(cacheKey, normalizeStormGlassData);

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} normalized data saved in cache completed`,
        });

        return right(normalizeStormGlassData);
      }

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${FetchPointService.name} normalized data obtained from cache with key ${cacheKey}`,
      });

      return right(wavesPoints);
    } catch (err) {
      this.loggerService.log({
        level: TypesLogger.ERROR,
        message: `${FetchPointService.name} error in call Stormglass API: ${JSON.stringify(
          err.response.data,
        )} Code: ${err.response.status}`,
      });

      return left(
        new StormGlassResponseError(
          `${JSON.stringify(err.response.data)} Code: ${err.response.status}`,
        ),
      );
    }
  }
}
