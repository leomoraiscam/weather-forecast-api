import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { Either } from '@src/shared/logic/either';

import { IGetBeachForecastInput } from '../dtos/get-beach-forecast-input';
import { TimeGroupedBeachForecast } from '../dtos/timed-grouped-beach-forecast';

export type GetUserBeachesForecastResponse = Either<
  StormGlassResponseError,
  TimeGroupedBeachForecast[]
>;
export interface IGetUserBeachesForecastInterface {
  execute: (
    getBeachForecastInput: IGetBeachForecastInput,
  ) => Promise<GetUserBeachesForecastResponse>;
}
