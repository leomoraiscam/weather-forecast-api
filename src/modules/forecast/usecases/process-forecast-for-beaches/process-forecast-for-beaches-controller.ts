import { HttpResponse } from "@src/shared/http/dtos/http-response";
import { UseCase  } from "@src/main/adapters/ports/use-case";
import { ControllerError } from "@src/shared/errors/ports/controller-error"
import { badRequest, created, serverError } from "@src/shared/http/helpers/http-helper";
import { ForecastRatingBeach } from "../../dtos/forecast-rating-beach"
import { HttpRequest } from "@src/shared/http/dtos/http-request"

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle( 
    request:HttpRequest<{userId: string}>
  ): Promise<HttpResponse<ForecastRatingBeach | ControllerError>> {
    try {
      const { userId } = request

      const response = await this.usecase.execute(userId);

      if (response.isLeft()) {
        const error = response.value

        return badRequest(error)
      }
      
      return created<ForecastRatingBeach>(response);
    } catch (error) {
      return serverError(error);
    }
  }
}
