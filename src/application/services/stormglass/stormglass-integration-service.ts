import { IHttpProvider } from '@src/application/contracts/providers/http-provider/http-provider';
import { IStormGlassAPIIntegrationResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-api-integration-response';
import { IStormGlassIntegrationRequest } from '@src/application/contracts/services/stormglass/dtos/stormglass-integration-request';
import { IStormGlassIntegrationsService } from '@src/application/contracts/services/stormglass/stormglass-integration-interface';

export class StormGlassIntegrationService implements IStormGlassIntegrationsService {
  constructor(private requestProvider: IHttpProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  async execute(
    coordinates: IStormGlassIntegrationRequest,
  ): Promise<IStormGlassAPIIntegrationResponse> {
    try {
      const response = await this.requestProvider.get<IStormGlassAPIIntegrationResponse>(
        `${process.env.STORM_GLASS_API_URL}/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${coordinates.lat}&lng=${coordinates.lng}`,
        {
          headers: {
            Authorization: process.env.STORM_GLASS_API_KEY,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`StormGlass API request failed`);
    }
  }
}
