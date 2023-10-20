import { HttpResponse  } from "../ports/http/http-response";
import { UseCase  } from "../ports/use-case";
import { ControllerError } from "../errors/controller-error"
import { badRequest, created, serverError } from "../helper/http-helper";
import { MissingParamError } from "../errors/missing-param-error";
import { EnrichedForecastBeachesRatings } from "../../dtos/enriched-forecast-beaches-ratings"
import { HttpRequest } from "../ports/http/http-request"

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<any>
  ): Promise<HttpResponse<EnrichedForecastBeachesRatings | ControllerError>> {
    try {
      const lat = request.params && !request.params.lat;
      const lng = request.params && !request.params.lng;

      if (lat || lng) {
        const missing = lat ? 'lat' : 'lng';

       return badRequest<ControllerError>(
          new MissingParamError(missing.trim())
        );
      }

      const response = await this.usecase.execute({ lat, lng });

      return created<EnrichedForecastBeachesRatings>(response);
    } catch (error) {
      return serverError<ControllerError>(error);
    }
  }
}
