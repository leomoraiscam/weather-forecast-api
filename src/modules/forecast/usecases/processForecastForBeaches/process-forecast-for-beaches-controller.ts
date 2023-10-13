import { HttpResponse  } from "../ports/http/http-response";
import { UseCase  } from "../ports/use-case";
import { ControllerError } from "../errors/controller-error"
import { badRequest, created, serverError } from "../helper/http-helper";
import { MissingParamError } from "../errors/missing-param-error";
import { EnrichedForecastBeachesRatings } from "../../dtos/enriched-forecast-beaches-ratings"
import { BeachCoordinate } from "../../dtos/beach-cordinate"

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: {
      params: BeachCoordinate
    }
  ): Promise<HttpResponse<EnrichedForecastBeachesRatings | ControllerError>> {
    try {
      if (!request.params.lat || !request.params.lng) {
        const missing = !request.params.lat ? 'lat' : 'lng';

       return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      }

      const response = await this.usecase.execute({ lat: request.params.lat, lng: request.params.lng });

      return created<EnrichedForecastBeachesRatings>(response);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
