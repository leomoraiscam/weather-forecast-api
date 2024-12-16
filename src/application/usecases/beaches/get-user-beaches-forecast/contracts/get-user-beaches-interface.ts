import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';
import { Either } from '@src/shared/core/either';

import { IGetBeachForecastInput } from '../../dtos/get-beach-forecast-input';
import { TimeGroupedBeachForecast } from '../../dtos/timed-grouped-beach-forecast';

export type GetUserBeachesForecastResponse = Either<
  StormGlassResponseError,
  TimeGroupedBeachForecast[]
>;
export interface IGetUserBeachesForecastUseCase {
  execute: (
    getBeachForecastInput: IGetBeachForecastInput,
  ) => Promise<GetUserBeachesForecastResponse>;
}
