import { RedisCacheService } from '@src/external/services/cache-service/services/redis-cache-service';
import { BeachRepository } from '@src/external/database/mongodb/implementations/beach-repository';
import { UserRepository } from '@src/external/database/mongodb/implementations/user-repository';
import { AxiosRequestService } from '@src/external/services/http-service/services/axios-request-service';
import { WinstonLoggerService } from '@src/external/services/logger-service/services/pino-logger-service';
import { FetchPointService } from '@src/external/services/stormglass-service/services/fetch-point-service';
import { IController } from '@src/main/adapters/ports/controller';
import { UserBeachForecastProcessingController } from '@src/modules/forecast/usecases/user-beach-forecast-processing/user-beach-forecast-processing-controller';
import { UserBeachForecastProcessingUseCase } from '@src/modules/forecast/usecases/user-beach-forecast-processing/user-beach-forecast-processing-use-case';

export const makeUserBeachForecastProcessingController = (): IController => {
  const cacheService = new RedisCacheService();
  const axiosRequestService = new AxiosRequestService();
  const loggerProvider = new WinstonLoggerService();
  const stormGlassService = new FetchPointService(
    axiosRequestService,
    cacheService,
    loggerProvider,
  );
  const usersRepository = new UserRepository();
  const beachesRepository = new BeachRepository();
  const userBeachForecastProcessingUseCase = new UserBeachForecastProcessingUseCase(
    stormGlassService,
    usersRepository,
    beachesRepository,
    loggerProvider,
  );
  const userBeachForecastProcessingController = new UserBeachForecastProcessingController(
    userBeachForecastProcessingUseCase,
  );

  return userBeachForecastProcessingController;
};
