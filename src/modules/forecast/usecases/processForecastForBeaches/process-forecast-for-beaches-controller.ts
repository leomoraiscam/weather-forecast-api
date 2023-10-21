import { HttpResponse } from "@src/shared/http/dtos/http-response";
import { UseCase  } from "@src/shared/http/ports/use-case";
import { ControllerError } from "@src/shared/errors/ports/controller-error"
import { badRequest, created, serverError } from "@src/shared/http/helpers/http-helper";
import { MissingParamError } from "@src/shared/errors/exceptions/missing-param-error";
import { EnrichedForecastBeachesRatings } from "../../dtos/enriched-forecast-beaches-ratings"
import { HttpRequest } from "@src/shared/http/dtos/http-request"
import { BeachCoordinate } from "../../dtos/beach-cordinate";

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request:HttpRequest<BeachCoordinate>
  ): Promise<HttpResponse<EnrichedForecastBeachesRatings | ControllerError>> {
    try {
      const { params } = request

      const lat = params && !params.lat;
      const lng = params && !params.lng;

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
