import { Beach, BeachForecast } from "../../dtos/beach-forecast";
import { TimeForecast } from "../../dtos/time-forecast";
import { normalizeForecastByTime } from "../helper/normalize-forecast-by-time-helper"
import { BeachPosition } from "@config/constants/beach-position-enum";
import { UseCase } from "@src/shared/http/ports/use-case"
import { FetchPointNormalize } from "@src/external/stormglass-service/ports/dtos/fetch-point-normalize"
import { Either, left, right } from "@src/shared/logic/Either";
import { StormGlassResponseError } from "@src/external/stormglass-service/errors/stormglass-response-error";

export class ProcessForecastBeachesUseCase {
  constructor(private stormGlassService: UseCase){}

  public async execute(_: Beach[]): Promise<Either<
    | StormGlassResponseError,
    TimeForecast[]
  >> {
      const beachForecastsSources: BeachForecast[] = [];

      const mockedBeaches: Beach[] = [
        {
          name: 'Dee Why',
          lat: 151.289824,
          lng: 151.289824,
          position: BeachPosition.E,
        },
      ];

      for (const beach of mockedBeaches) {
        const { lat, lng, name, position } = beach

        const points = await this.stormGlassService.execute({lat, long: lng});

        if (!points.value.length) {
          return left(points.value)
        }

        const enrichedBeachRating = points.value.map((pointForecast: FetchPointNormalize) => ({
          lat,
          lng,
          name,
          position,
          rating: 1,
          ...pointForecast
        }))

        beachForecastsSources.push(...enrichedBeachRating);
      }
      
      return right(normalizeForecastByTime(beachForecastsSources))
    }
}