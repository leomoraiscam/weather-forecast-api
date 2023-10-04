import { ForecastPoint } from "@src/external/stormglass-service/ports/dtos/forecast-point";
import { StormGlassService } from "@src/external/stormglass-service/stormglass-service";
import { InternalError } from "@src/utils/errors/internal-server-error";

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export interface TimeForecast {
  time: string;
  forecast: BeachForecast[]
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}

export class ForecastUseCase {
  constructor(protected stormGlassService = new StormGlassService()){}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];

      for (const beach of beaches) {
        const points = await this.stormGlassService.fetchPoints({lat: beach.lat, long: beach.lng});
      
        const enrichedBeachData = points.map((e) => ({
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
          ...e
        }))

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.forecastByTime(pointsWithCorrectSources)
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message)
    }
  }


  private forecastByTime(forecast:BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for(const point of forecast) {
      const timePoint = forecastByTime.find((forecastData) => forecastData.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point]
        })
      }
    }

    return forecastByTime
  }
}
