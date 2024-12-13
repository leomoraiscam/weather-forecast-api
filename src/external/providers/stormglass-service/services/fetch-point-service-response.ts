import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { Either } from '@src/shared/core/either';

import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';

export type FetchPointServiceResponse = Either<StormGlassResponseError, IFetchPointNormalize[]>;
