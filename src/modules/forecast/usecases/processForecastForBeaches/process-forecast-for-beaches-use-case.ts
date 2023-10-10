import { FetchPointService } from "@src/external/stormglass-service/fetch-point-service";
import { ForecastProcessingInternalError } from "../errors/forecast-processing-error"
import { Beach, BeachForecast } from "../../dtos/beach-forecast";
import { TimeForecast } from "../../dtos/time-forecast";
import { forecastByTime } from "../../utils/group-forecast-by-time"

export class ProcessForecastBeachesUseCase {
  constructor(protected stormGlassService = new FetchPointService()){}

  public async execute(beaches: Beach[]): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];

      for (const beach of beaches) {
        const points = await this.stormGlassService.execute({lat: beach.lat, long: beach.lng});
      
        const enrichedBeachData = points.map((pointForecast) => ({
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
          ...pointForecast
        }))

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return forecastByTime(pointsWithCorrectSources)
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message)
    }
  }
}
