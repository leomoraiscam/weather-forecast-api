import { IFetchPointCoordinate } from '@src/external/services/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '@src/external/services/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '@src/external/services/stormglass-service/ports/stormglass-service';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { Either, right } from '@src/shared/logic/either';

import fetchPointsNormalizedResponse from '../data/fetch-points-normalized-response.json';

export class StormGlassServiceStub implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right(fetchPointsNormalizedResponse);
  }
}
