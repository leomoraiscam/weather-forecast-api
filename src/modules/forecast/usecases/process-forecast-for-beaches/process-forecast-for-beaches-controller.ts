import { IUseCase } from '@src/main/adapters/ports/use-case';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import { notFound, ok, serverError } from '@src/shared/http/helpers/http-helper';

import { IBeachRatingForecast } from '../../dtos/beach-rating-forecast';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';

export class FetchPointsController {
  private readonly usecase: IUseCase;

  constructor(usecase: IUseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: IHttpRequest<{ userId: string }>,
  ): Promise<IHttpResponse<IBeachRatingForecast | IControllerError>> {
    try {
      const { userId } = request;

      const response = await this.usecase.execute(userId);

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case BeachesNotFoundError:
            return notFound(error);
          case UserNotFoundError:
            return notFound(error);
          default:
            return notFound(error);
        }
      }

      return ok<IBeachRatingForecast>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
