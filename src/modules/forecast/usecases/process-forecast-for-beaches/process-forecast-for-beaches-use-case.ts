import { ForecastRatingBeach } from "../../dtos/forecast-rating-beach";
import { Beach } from "../../dtos/beach"
import { TimeForecast } from "../../dtos/time-forecast";
import { normalizeForecastByTime } from "../../utils/normalize-forecast-by-time"
import { BeachPosition } from "@config/constants/beach-position-enum";
import { UseCase } from "@src/shared/http/ports/use-case"
import { FetchPointNormalize } from "@src/external/stormglass-service/dtos/fetch-point-normalize"
import { Either, left, right } from "@src/shared/logic/Either";
import { StormGlassResponseError } from "@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error";

export class ProcessForecastBeachesUseCase {
  constructor(private stormGlassService: UseCase){}

  public async execute(_: Beach[]): Promise<Either<
    | StormGlassResponseError, 
    TimeForecast[]
  >> {
      const beachForecastsSources: ForecastRatingBeach[] = [];

      const mockedBeaches: Beach[] = [
        {
          name: 'Dee Why',
          lat: -33.792726,
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

        const enrichedBeachRating = points.value.map((pointForecast: FetchPointNormalize): ForecastRatingBeach => ({
          lat,
          lng,
          name,
          position,
          rating: 1,
          ...pointForecast
        }))

        beachForecastsSources.push(...enrichedBeachRating);
      }

      const normalizeForecast = normalizeForecastByTime(beachForecastsSources)
      
      return right(normalizeForecast)
    }
}