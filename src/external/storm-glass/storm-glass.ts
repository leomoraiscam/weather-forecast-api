import { AxiosStatic } from "axios";

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

export class StormGlass {
  constructor(protected request: AxiosStatic) {}
 
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints(lat: number, long: number): Promise<ForecastPoint[]> {
    const response = await this.request.get<StormGlassForecastResponse>(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
    {
      headers: {
        Authorization: 'fake-token',
      },
    });

    return this.normalizeResponse(response.data);
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