import { GetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/get-user-beaches-forecast-use-case';
import { AxiosRequestService } from '@src/external/providers/http-service/services/axios-request-service';
import { FetchPointService } from '@src/external/providers/stormglass-service/services/fetch-point-service';
import { BeachRepository } from '@src/infrastructure/database/mongo/repositories/beaches/beach-repository';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { RedisCacheProvider } from '@src/infrastructure/providers/cache-provider/redis-cache-provider';
import { PinoLoggerProvider } from '@src/infrastructure/providers/logger-provider/pino-logger-service';
import { IController } from '@src/main/adapters/ports/controller';
import { GetUserBeachesForecastController } from '@src/presentation/controllers/get-user-beaches-forecast-controller';

export const makeUserBeachForecastProcessingController = (): IController => {
  const cacheProvider = new RedisCacheProvider();
  const axiosRequestService = new AxiosRequestService();
  const loggerProvider = new PinoLoggerProvider();
  const stormGlassService = new FetchPointService(
    axiosRequestService,
    cacheProvider,
    loggerProvider,
  );
  const usersRepository = new UserRepository();
  const beachesRepository = new BeachRepository();
  const getUserBeachesForecastUseCase = new GetUserBeachesForecastUseCase(
    stormGlassService,
    usersRepository,
    beachesRepository,
    loggerProvider,
  );
  const getUserBeachesForecastController = new GetUserBeachesForecastController(
    getUserBeachesForecastUseCase,
  );

  return getUserBeachesForecastController;
};
