import { ICacheProvider } from '@src/application/contracts/providers/cache-provider/cache-provider';
import { IStormGlassAPIIntegrationResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-api-integration-response';
import { IStormGlassIntegrationResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-integration-response';
import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassIntegrationsService } from '@src/application/contracts/services/stormglass/stormglass-integration-interface';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';

export class StormGlassService implements IStormGlassService {
  constructor(
    private cacheService: ICacheProvider,
    private stormGlassIntegration: IStormGlassIntegrationsService,
  ) {}

  async execute(input: IStormGlassServiceInput): Promise<IStormGlassIntegrationResponse[]> {
    const { userId, lat, lng, page, pageSize } = input;
    const cacheKey = `forecast-point:${lat}:${lng}:${userId}:${page}-${pageSize}`;
    const wavesPoints = await this.cacheService.recover<IStormGlassIntegrationResponse[]>(cacheKey);

    if (!wavesPoints) {
      const response = await this.stormGlassIntegration.execute({ lat, lng });
      const normalizeStormGlassData = this.toNormalize(response);

      await this.cacheService.save<IStormGlassIntegrationResponse[]>(
        cacheKey,
        normalizeStormGlassData,
      );

      return normalizeStormGlassData;
    }

    return wavesPoints;
  }

  private toNormalize(data: IStormGlassAPIIntegrationResponse): IStormGlassIntegrationResponse[] {
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
