import { ProcessForecastBeachesUseCase } from "@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-use-case"
import { FetchPointsController } from "@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-controller";
import { AxiosRequestProvider } from "@src/external/stormglass-service/providers/implementations/axios-request-provider";
import { FetchPointService } from  "@src/external/stormglass-service/services/fetch-point-service"
import { Controller } from "../../adapters/ports/controller";
import { UserRepository } from "@src/modules/accounts/repositories/implementations/users-repository";
import { BeachRepository } from "@src/modules/forecast/repositories/implementations/beach-repository";

export const makeFetchPointController = (): Controller => {
  const axiosRequestProvider = new AxiosRequestProvider();
  const stormGlassService = new FetchPointService(axiosRequestProvider)

  const usersRepository = new UserRepository();
  const beachesRepository = new BeachRepository();

  const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(stormGlassService,usersRepository,beachesRepository);
  const fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

  return fetchPointsController;
}