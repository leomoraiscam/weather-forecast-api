import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { badRequest, ok, serverError } from '@src/shared/http/helpers/http-helper';

import { IForecastRatingBeach } from '../../dtos/forecast-rating-beach';

export class FetchPointsController {
  private readonly usecase: IUseCase;

  constructor(usecase: IUseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: IHttpRequest<{ userId: string }>,
  ): Promise<IHttpResponse<IForecastRatingBeach | IControllerError>> {
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
