import { StormGlassIntegrationService } from '@src/application/services/stormglass/stormglass-integration-service';
import { StormGlassService } from '@src/application/services/stormglass/stormglass-service';
import { GetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/get-user-beaches-forecast-use-case';
import { BeachRepository } from '@src/infrastructure/database/mongo/repositories/beaches/beach-repository';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { RedisCacheProvider } from '@src/infrastructure/providers/cache-provider/redis-cache-provider';
import { AxiosProvider } from '@src/infrastructure/providers/http-provider/axios-provider';
import { PinoLoggerProvider } from '@src/infrastructure/providers/logger-provider/pino-logger-service';
import { IController } from '@src/main/adapters/ports/controller';
import { GetUserBeachesForecastController } from '@src/presentation/controllers/get-user-beaches-forecast-controller';

export const makeUserBeachForecastProcessingController = (): IController => {
  const cacheProvider = new RedisCacheProvider();
  const loggerProvider = new PinoLoggerProvider();
  const axiosProvider = new AxiosProvider(loggerProvider);
  const stormGlassIntegrationService = new StormGlassIntegrationService(axiosProvider);
  const stormGlassService = new StormGlassService(cacheProvider, stormGlassIntegrationService);
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
