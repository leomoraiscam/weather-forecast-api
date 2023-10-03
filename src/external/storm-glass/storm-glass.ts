import { InternalError } from "@src/utils/errors/internal-server-error";
import { AxiosStatic } from "axios";
import * as HTTPUtil from "@src/utils/request"

interface StormGlassPointSource {
  [key: string]: number
}

interface StormGlassPoint {
  time: string;
  swellDirection: StormGlassPointSource;
  swellHeight: StormGlassPointSource;
  swellPeriod: StormGlassPointSource;
  waveDirection: StormGlassPointSource;
  waveHeight: StormGlassPointSource;
  windDirection: StormGlassPointSource;
  windSpeed: StormGlassPointSource;
}

interface StormGlassForecastResponse {
  hours: StormGlassPoint[]
}

interface ForecastPoint {
  time: string;
  swellDirection: number,
  swellHeight: number,
  swellPeriod: number,
  waveDirection: number,
  waveHeight: number,
  windDirection: number,
  windSpeed: number
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${internalMessage}: ${message}`)
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage =
      'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlass {
  constructor(protected request = new HTTPUtil.Request()) {}
 
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints(lat: number, long: number): Promise<ForecastPoint[]> {
    try {
      const response = await this.request.get<StormGlassForecastResponse>(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
      {
        headers: {
          Authorization: 'fake-token',
        },
      });

      return this.normalizeResponse(response.data);
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

  private normalizeResponse(point: StormGlassForecastResponse): ForecastPoint[] {
    return point.hours.filter((point) => (
      !!(
        point.time && 
        point.swellDirection?.[this.stormGlassAPISource] && 
        point.swellHeight?.[this.stormGlassAPISource] && 
        point.swellPeriod?.[this.stormGlassAPISource] && 
        point.waveDirection?.[this.stormGlassAPISource] && 
        point.waveHeight?.[this.stormGlassAPISource] && 
        point.windDirection?.[this.stormGlassAPISource] && 
        point.windSpeed?.[this.stormGlassAPISource]
      )
    )).map((point) => ({
        time: point.time,
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource]
    }))
  }
}