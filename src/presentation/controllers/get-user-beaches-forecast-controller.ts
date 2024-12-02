import { BeachNotFoundError } from '@src/application/usecases/beaches/errors/beach-not-found-error';
import { UserNotFoundError } from '@src/application/usecases/beaches/errors/user-not-found-error';
import { IGetBeachForecastInput } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/get-beach-forecast-input';
import { TimeGroupedBeachForecast } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/timed-grouped-beach-forecast';
import { IGetUserBeachesForecastInterface } from '@src/application/usecases/beaches/get-user-beaches-forecast/interfaces/get-user-beaches-forecast-interface';
import {
  ok,
  notFound,
  unprocessableEntity,
  serverError,
} from '@src/presentation/controllers/helpers/http-helper';

import { IHttpRequest } from '../interfaces/http-request';
import { IHttpResponse } from '../interfaces/http-response';

export class GetUserBeachesForecastController {
  constructor(private getUserBeachesForecastInterface: IGetUserBeachesForecastInterface) {}

  async handle(request: IHttpRequest<IGetBeachForecastInput>): Promise<IHttpResponse> {
    try {
      const { userId } = request;
      const { query } = request;
      const response = await this.getUserBeachesForecastInterface.execute({
        userId,
        page: Number(query.page),
        pageSize: Number(query.pageSize),
      });

      if (response.isLeft()) {
        const error = response.value;

        switch (error.constructor) {
          case BeachNotFoundError:
            return notFound(error);
          case UserNotFoundError:
            return notFound(error);
          default:
            return unprocessableEntity(error);
        }
      }

      return ok<TimeGroupedBeachForecast[]>(response.value);
    } catch (error) {
      return serverError(error);
    }
  }
}
