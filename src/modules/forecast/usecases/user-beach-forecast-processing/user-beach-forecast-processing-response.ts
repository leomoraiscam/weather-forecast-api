import { ITimeBeachRatingForecastDTO } from '@src/modules/forecast/dtos/time-beach-rating-forecast';
import { Either } from '@src/shared/core/either';

import { StormGlassResponseError } from './errors/stormglass-response-error';

export type UserBeachForecastProcessingResponse = Either<
  StormGlassResponseError,
  ITimeBeachRatingForecastDTO[]
>;
