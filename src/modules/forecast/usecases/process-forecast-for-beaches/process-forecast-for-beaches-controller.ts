import { UseCase } from '@src/main/adapters/ports/use-case';
import { ControllerError } from '@src/shared/errors/ports/controller-error';
import { HttpRequest } from '@src/shared/http/dtos/http-request';
import { HttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, ok, serverError } from '@src/shared/http/helpers/http-helper';

import { IForecastRatingBeach } from '../../dtos/forecast-rating-beach';

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: HttpRequest<{ userId: string }>,
  ): Promise<HttpResponse<IForecastRatingBeach | ControllerError>> {
    try {
      const { userId } = request;

      const response = await this.usecase.execute(userId);

      if (response.isLeft()) {
        const error = response.value;

        return badRequest(error);
      }

      return ok<IForecastRatingBeach>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
