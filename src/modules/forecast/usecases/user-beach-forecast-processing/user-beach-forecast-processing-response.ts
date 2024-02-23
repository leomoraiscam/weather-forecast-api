/* eslint-disable import/no-unresolved */
import { Either } from '@src/shared/logic/either';

import { ITimeBeachRatingForecastDTO } from '../../dtos/time-beach-rating-forecast';
import { StormGlassResponseError } from './errors/stormglass-response-error';

export type UserBeachForecastProcessingResponse = Either<
  StormGlassResponseError,
  ITimeBeachRatingForecastDTO[]
>;
