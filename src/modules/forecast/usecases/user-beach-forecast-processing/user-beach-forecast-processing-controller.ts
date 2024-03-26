import { IUseCase } from '@src/main/adapters/ports/use-case';
import { ITimeBeachRatingForecastDTO } from '@src/modules/forecast/dtos/time-beach-rating-forecast';
import { IControllerError } from '@src/shared/errors/ports/controller-error';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { IHttpResponse } from '@src/shared/http/dtos/http-response';
import {
  notFound,
  ok,
  serverError,
  unprocessableEntity,
} from '@src/shared/http/helpers/http-helper';

import { IFindTimeBeachRatingForecastDTO } from '../../dtos/find-time-beaches-rating-forecast';
import { BeachesNotFoundError } from './errors/beaches-not-found-error';
import { UserNotFoundError } from './errors/user-not-found-error';
import { UserBeachForecastProcessingResponse } from './user-beach-forecast-processing-response';

export class UserBeachForecastProcessingController {
  private readonly usecase: IUseCase<
    IFindTimeBeachRatingForecastDTO,
    UserBeachForecastProcessingResponse
  >;

  constructor(
    usecase: IUseCase<IFindTimeBeachRatingForecastDTO, UserBeachForecastProcessingResponse>,
  ) {
    this.usecase = usecase;
  }

  async handle(
    request: IHttpRequest<Partial<IFindTimeBeachRatingForecastDTO>>,
  ): Promise<IHttpResponse<ITimeBeachRatingForecastDTO[] | IControllerError>> {
    try {
      const { userId } = request;
      const { query } = request;

      const response = await this.usecase.execute({
        userId,
        page: Number(query.page),
        pageSize: Number(query.pageSize),
      });

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case BeachesNotFoundError:
            return notFound(error);
          case UserNotFoundError:
            return notFound(error);
          default:
            return unprocessableEntity(error);
        }
      }

      return ok<ITimeBeachRatingForecastDTO[]>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
