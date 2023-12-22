import { RedisCacheProvider } from '@src/external/cache-service/services/redis-cache-provider';
import { AxiosRequestProvider } from '@src/external/http-service/services/axios-request-provider';
import { WinstonLoggerService } from '@src/external/logger-service/services/pino-logger-service';
import { FetchPointService } from '@src/external/stormglass-service/services/fetch-point-service';
import { UserRepository } from '@src/modules/accounts/repositories/implementations/users-repository';
import { BeachRepository } from '@src/modules/forecast/repositories/implementations/beach-repository';
import { FetchPointsController } from '@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-controller';
import { ProcessForecastBeachesUseCase } from '@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-use-case';

import { IController } from '../../adapters/ports/controller';

export const makeFetchPointController = (): IController => {
  const axiosRequestProvider = new AxiosRequestProvider();
  const cacheProvider = new RedisCacheProvider();
  const loggerProvider = new WinstonLoggerService();

  const stormGlassService = new FetchPointService(
    axiosRequestProvider,
    cacheProvider,
    loggerProvider,
  );

  const usersRepository = new UserRepository();
  const beachesRepository = new BeachRepository();

  const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(
    stormGlassService,
    usersRepository,
    beachesRepository,
    loggerProvider,
  );
  const fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

  return fetchPointsController;
};
