import { IHttpProvider } from '@src/application/contracts/providers/http-provider/http-provider';
import { IStormGlassAPIRequest } from '@src/application/contracts/services/stormglass/dtos/stormglass-api-request';
import { IStormGlassAPIResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-api-response';
import { IStormGlassAPIClient } from '@src/application/contracts/services/stormglass/stormglass-api-client-interface';
import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';

export class StormGlassAPIClient implements IStormGlassAPIClient {
  constructor(private requestProvider: IHttpProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  async execute(coordinates: IStormGlassAPIRequest): Promise<IStormGlassAPIResponse> {
    try {
      const response = await this.requestProvider.get<IStormGlassAPIResponse>(
        `${process.env.STORM_GLASS_API_URL}/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${coordinates.lat}&lng=${coordinates.lng}`,
        {
          headers: {
            Authorization: process.env.STORM_GLASS_API_KEY,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new StormGlassResponseError();
    }
  }
}
