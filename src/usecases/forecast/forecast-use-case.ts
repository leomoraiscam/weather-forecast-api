import { ForecastPoint } from "@src/external/stormglass-service/ports/dtos/forecast-point";
import { StormGlassService } from "@src/external/stormglass-service/stormglass-service";

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

export class ForecastUseCase {
  constructor(protected stormGlassService = new StormGlassService()){}

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
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

    return pointsWithCorrectSources
  }
}
