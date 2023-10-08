import * as HTTPUtil from "@src/utils/request"
import { FetchPointNormalize } from "./ports/dtos/fetch-point-normalize";
import { StormGlassForecastResponse } from "./ports/dtos/stormglass-response";
import { StormGlassMapper } from "./mapper/stormglass-mapper"
import { FetchPointCoordinate } from "./ports/dtos/fetch-point-coordinate";
import { StormGlassService } from "./ports/stormglass-service";
import { StormGlassResponseError } from "./errors/stormglass-response-error";
import { ClientRequestError } from "./errors/client-request-error";

export class FetchPointService implements StormGlassService {
  constructor(protected request = new HTTPUtil.Request()) {}
 
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({ lat, long }: FetchPointCoordinate): Promise<FetchPointNormalize[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
      {
        headers: {
          Authorization: 'fake-token',
        },
      });

      return StormGlassMapper.toNormalize(response.data);
    } catch (err) {
      if (HTTPUtil.Request.isRequestError(err)) {
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