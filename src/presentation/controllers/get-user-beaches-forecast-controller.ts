import { IGetBeachForecastInput } from '@src/application/usecases/beaches/dtos/get-beach-forecast-input';
import { TimeGroupedBeachForecast } from '@src/application/usecases/beaches/dtos/timed-grouped-beach-forecast';
import { BeachNotFoundError } from '@src/application/usecases/beaches/errors/beach-not-found-error';
import { UserNotFoundError } from '@src/application/usecases/beaches/errors/user-not-found-error';
import { IGetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/contracts/get-user-beaches-interface';
import { ok, notFound, unprocessableEntity } from '@src/presentation/helpers/http-helper';

import { IController } from '../contracts/controller';
import { IHttpRequest } from '../contracts/http-request';
import { IHttpResponse } from '../contracts/http-response';

export class GetUserBeachesForecastController implements IController {
  constructor(private getUserBeachesForecastUseCase: IGetUserBeachesForecastUseCase) {}

  async handle(request: IHttpRequest<IGetBeachForecastInput>): Promise<IHttpResponse> {
    const { userId } = request;
    const { query } = request;
    const response = await this.getUserBeachesForecastUseCase.execute({
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
  }
}
