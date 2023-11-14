import { ProcessForecastBeachesUseCase } from "@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-use-case"
import { FetchPointsController } from "@src/modules/forecast/usecases/process-forecast-for-beaches/process-forecast-for-beaches-controller";
import { AxiosRequestProvider } from "@src/external/stormglass-service/providers/implementations/axios-request-provider";
import { FetchPointService } from  "@src/external/stormglass-service/services/fetch-point-service"
import { Controller } from "../../adapters/ports/controller";

export const makeFetchPointController = (): Controller => {
  const axiosRequestProvider = new AxiosRequestProvider();
  const stormGlassService = new FetchPointService(axiosRequestProvider)

  const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(stormGlassService);
  const fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

  return fetchPointsController;
}