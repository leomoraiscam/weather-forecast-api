import { IController } from '@src/main/adapters/ports/controller';
import { GetUserBeachesForecastController } from '@src/presentation/controllers/get-user-beaches-forecast-controller';

import { makeGetUserBeachesForecastUseCase } from '../usecases/get-user-beaches-forecast-factory';

export const makeGetUserBeachesForecastController = (): IController => {
  const getUserBeachesForecastController = new GetUserBeachesForecastController(
    makeGetUserBeachesForecastUseCase(),
  );

  return getUserBeachesForecastController;
};
