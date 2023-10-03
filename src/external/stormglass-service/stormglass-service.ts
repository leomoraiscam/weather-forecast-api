import * as HTTPUtil from "@src/utils/request"
import { ForecastPoint } from "./ports/dtos/forecast-point";
import { StormGlassForecastResponse } from "./ports/dtos/stormglass-response";
import {StormGlassMapper  } from "./mapper/stormglass-mapper"
import { ForecastCoordinates } from "./ports/dtos/forecast-coordinates";
import { ForecastService } from "./ports/forecast-service";
import { StormGlassResponseError } from "./errors/storm-glass-error";
import { ClientRequestError } from "./errors/client-request-error";

export class StormGlassService implements ForecastService {
  constructor(protected request = new HTTPUtil.Request()) {}
 
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints({ lat, long }: ForecastCoordinates): Promise<ForecastPoint[]> {
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