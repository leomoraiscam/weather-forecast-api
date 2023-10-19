import { ForecastProcessingInternalError } from "../errors/forecast-processing-error"
import { Beach, BeachForecast } from "../../dtos/beach-forecast";
import { TimeForecast } from "../../dtos/time-forecast";
import { normalizeForecastByTime } from "../helper/normalize-forecast-by-time-helper"
import { BeachPosition } from "@config/constants/beach-position-enum";
import { UseCase } from "../ports/use-case"

export class ProcessForecastBeachesUseCase {
  constructor(private stormGlassService: UseCase){}

  public async execute(beaches: Beach[]): Promise<TimeForecast[]> {
    try {
      const beachForecastsSources: BeachForecast[] = [];

      const mockedBeaches: Beach[] = [
          {
            name: 'Dee Why',
            lat: -33.792726,
            lng: 151.289824,
            position: BeachPosition.E,
          }
      ];

      for (const beach of beaches || mockedBeaches) {
        const points = await this.stormGlassService.execute({lat: beach.lat, long: beach.lng});
      
        const enrichedBeachRating = points.map((pointForecast: any) => ({
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
          ...pointForecast
        }))

        beachForecastsSources.push(...enrichedBeachRating);
      }

      return normalizeForecastByTime(beachForecastsSources)
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message)
    }
  }
}
