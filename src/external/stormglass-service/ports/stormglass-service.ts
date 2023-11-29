import { Either } from '@src/shared/logic/either';

import { StormGlassResponseError } from '../../../modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';

export interface IStormGlassService {
  execute: (
    options: IFetchPointCoordinate,
  ) => Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>>;
}
