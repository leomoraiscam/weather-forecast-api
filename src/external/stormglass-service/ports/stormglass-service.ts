import { Either } from '@src/shared/logic/either';

import { StormGlassResponseError } from '../../../modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';

export interface IStormGlassService {
  execute: (
    options: IFetchPointCoordinate,
  ) => Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>>;
}
