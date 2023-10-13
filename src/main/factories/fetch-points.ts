import { ProcessForecastBeachesUseCase } from "@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-use-case"
import { FetchPointsController } from "@src/modules/forecast/usecases/processForecastForBeaches/process-forecast-for-beaches-controller";

export const makeFetchPointController = (): FetchPointsController => {
  const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase();
  const fetchPointsController = new FetchPointsController(processForecastBeachesUseCase);

  return fetchPointsController;
}