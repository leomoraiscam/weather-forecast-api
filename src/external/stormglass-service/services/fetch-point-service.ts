import { FetchPointNormalize } from "../dtos/fetch-point-normalize";
import { StormGlassForecastResponse } from "../dtos/stormglass-response";
import { StormGlassMapper } from "../mapper/stormglass-mapper"
import { FetchPointCoordinate } from "../dtos/fetch-point-coordinate";
import { StormGlassService } from "../ports/stormglass-service";
import { StormGlassResponseError } from "@src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error";
import { IRequestProvider } from "../providers/models/request-provider"
import { Either, left, right } from "@src/shared/logic/Either";

export class FetchPointService implements StormGlassService {
  constructor(private requestProvider: IRequestProvider) {}

  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async execute({ lat, long }: FetchPointCoordinate): Promise<Either<StormGlassResponseError, FetchPointNormalize[]>> {
    try {
      const response = await this.requestProvider.get<StormGlassForecastResponse>({
        url: `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
        config:       {
          headers: {
            Authorization: 'fake-token',
          }
        }
      });

      return right(StormGlassMapper.toNormalize(response.data))
    } catch (err) {
      return left(new StormGlassResponseError(
          `${JSON.stringify(err.response.data)} Code: ${
            err.response.status
          }`
        )
      )
    }
  }
}