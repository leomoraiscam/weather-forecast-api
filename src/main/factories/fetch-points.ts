import { ProcessForecastBeachesUseCase } from "@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-use-case"
import { FetchPointsController } from "@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-controller";
import { AxiosRequestProvider } from "@src/external/stormglass-service/providers/implementations/axios-request-provider";
import { FetchPointService } from  "@src/external/stormglass-service/fetch-point-service"

export const makeFetchPointController = (): FetchPointsController => {
  const axiosRequestProvider = new AxiosRequestProvider();
  const stormGlassService = new FetchPointService(axiosRequestProvider)

  const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(stormGlassService);
  const fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

  return fetchPointsController;
}