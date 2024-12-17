import { IController } from '@src/presentation/contracts/controller';
import { GetUserBeachesForecastController } from '@src/presentation/controllers/get-user-beaches-forecast-controller';
import { WebController } from '@src/presentation/controllers/web-controller';

import { makeGetUserBeachesForecastUseCase } from '../usecases/get-user-beaches-forecast-factory';

export const makeGetUserBeachesForecastController = (): IController => {
  const getUserBeachesForecastController = new WebController(
    new GetUserBeachesForecastController(makeGetUserBeachesForecastUseCase()),
  );

  return getUserBeachesForecastController;
};
