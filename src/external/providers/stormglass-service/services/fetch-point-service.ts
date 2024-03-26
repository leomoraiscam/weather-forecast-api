/* eslint-disable import/no-unresolved */
import { TypesLogger } from '@config/constants/types-logger-enum';
import { ICacheService } from '@src/external/providers/cache-service/ports/cache-service';
import { IRequestService } from '@src/external/providers/http-service/ports/request-service';
import { ILoggerService } from '@src/external/providers/logger-service/ports/logger-service';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { left, right } from '@src/shared/logic/either';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';
import { IStormGlassForecastResponse } from '../dtos/stormglass-response';
import { StormGlassMapper } from '../mapper/stormglass-mapper';
import { IStormGlassService } from '../ports/stormglass-service';
import { FetchPointServiceResponse } from './fetch-point-service-response';

export class FetchPointService implements IStormGlassService {
  constructor(
    private requestService: IRequestService,
    private cacheService: ICacheService,
    private loggerService: ILoggerService,
  ) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({
    lat,
    lng,
    userId,
    page,
    pageSize,
  }: IFetchPointCoordinate): Promise<FetchPointServiceResponse> {
    try {
      const cacheKey = `provider-forecast-point: ${userId}:${lat}-${lng}:${page}-${pageSize}`;

      const wavesPoints = await this.cacheService.recover<IFetchPointNormalize[]>(cacheKey);

      if (!wavesPoints) {
        const offset = (page - 1) * pageSize;

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} starting call the stormglass API`,
          metadata: {
            lat,
            lng,
            userId,
            page,
            pageSize,
            offset,
          },
        });

        const response = await this.requestService.get<IStormGlassForecastResponse>({
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

        const paginatedData = normalizeStormGlassData.slice(offset, offset + pageSize);

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} applying pagination to the normalized data`,
        });

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} Initializing data persistence in the cache`,
        });

        await this.cacheService.save<IFetchPointNormalize[]>(cacheKey, paginatedData);

        this.loggerService.log({
          level: TypesLogger.INFO,
          message: `${FetchPointService.name} paginated data saved in cache completed`,
        });

        return right(paginatedData);
      }

      this.loggerService.log({
        level: TypesLogger.INFO,
        message: `${FetchPointService.name} paginated data obtained from cache with key ${cacheKey}`,
      });

      return right(wavesPoints);
    } catch (err) {
      this.loggerService.log({
        level: TypesLogger.ERROR,
        message: `${FetchPointService.name} error in call Stormglass API: ${JSON.stringify(
          err.response.data,
        )} Code: ${err.response.status}`,
      });

      return left(new StormGlassResponseError());
    }
  }
}
