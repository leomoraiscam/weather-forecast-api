import { ICacheProvider } from '@src/application/contracts/providers/cache-provider/cache-provider';
import { IStormGlassAPIResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-api-response';
import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassServiceOutput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-output';
import { IStormGlassAPIClient } from '@src/application/contracts/services/stormglass/stormglass-api-client-interface';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';

export class StormGlassService implements IStormGlassService {
  constructor(
    private cacheService: ICacheProvider,
    private stormGlassAPIClient: IStormGlassAPIClient,
  ) {}

  async execute(input: IStormGlassServiceInput): Promise<IStormGlassServiceOutput[]> {
    const { userId, lat, lng, page, pageSize } = input;
    const cacheKey = `forecast-point:${lat}:${lng}:${userId}:${page}-${pageSize}`;
    const wavesPoints = await this.cacheService.recover<IStormGlassServiceOutput[]>(cacheKey);

    if (!wavesPoints) {
      const response = await this.stormGlassAPIClient.execute({ lat, lng });
      const normalizeStormGlassData = this.toNormalize(response);

      await this.cacheService.save<IStormGlassServiceOutput[]>(cacheKey, normalizeStormGlassData);

      return normalizeStormGlassData;
    }

    return wavesPoints;
  }

  private toNormalize(data: IStormGlassAPIResponse): IStormGlassServiceOutput[] {
    return data.hours
      .filter(
        (point) =>
          !!(
            point.time &&
            point.swellDirection?.['noaa'] &&
            point.swellHeight?.['noaa'] &&
            point.swellPeriod?.['noaa'] &&
            point.waveDirection?.['noaa'] &&
            point.waveHeight?.['noaa'] &&
            point.windDirection?.['noaa'] &&
            point.windSpeed?.['noaa']
          ),
      )
      .map((point) => ({
        time: point.time,
        swellDirection: point.swellDirection['noaa'],
        swellHeight: point.swellHeight['noaa'],
        swellPeriod: point.swellPeriod['noaa'],
        waveDirection: point.waveDirection['noaa'],
        waveHeight: point.waveHeight['noaa'],
        windDirection: point.windDirection['noaa'],
        windSpeed: point.windSpeed['noaa'],
      }));
  }
}
