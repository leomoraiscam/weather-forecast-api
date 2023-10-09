import { FetchPointService } from "@src/external/stormglass-service/fetch-point-service";
import { ForecastProcessingInternalError } from "../errors/forecast-processing-error"
import { Beach, BeachForecast } from "../../dtos/beach-forecast";
import { TimeForecast } from "../../dtos/time-forecast";
import { forecastByTime } from "../../utils/group-forecast-by-time"

export class ForecastUseCase {
  constructor(protected stormGlassService = new FetchPointService()){}

  public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForecast[] = [];

      for (const beach of beaches) {
        const points = await this.stormGlassService.execute({lat: beach.lat, long: beach.lng});
      
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

      return forecastByTime(pointsWithCorrectSources)
    } catch (error) {
      throw new ForecastProcessingInternalError(error.message)
    }
  }
}
