import { FetchPointNormalize } from "./ports/dtos/fetch-point-normalize";
import { StormGlassForecastResponse } from "./ports/dtos/stormglass-response";
import { StormGlassMapper } from "./mapper/stormglass-mapper"
import { FetchPointCoordinate } from "./ports/dtos/fetch-point-coordinate";
import { StormGlassService } from "./ports/stormglass-service";
import { StormGlassResponseError } from "./errors/stormglass-response-error";
import { ClientRequestError } from "./errors/client-request-error";
import { IRequestProvider } from "./providers/models/request-provider"

export class FetchPointService implements StormGlassService {
  constructor(private requestProvider: IRequestProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({ lat, long }: FetchPointCoordinate): Promise<FetchPointNormalize[]> {
    try {
      const response = await this.requestProvider.get<StormGlassForecastResponse>({
        url: `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
        config:       {
          headers: {
            Authorization: 'fake-token',
          }
        }
      });

      return StormGlassMapper.toNormalize(response.data);
    } catch (err) {
      if (err.response && err.response.status) {
        throw new StormGlassResponseError(
          `Error: ${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        );
      }

      throw new ClientRequestError(err.message);
    }
  }
}