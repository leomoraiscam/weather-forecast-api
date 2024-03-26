import { IFetchPointCoordinate } from '@src/external/providers/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '@src/external/providers/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '@src/external/providers/stormglass-service/ports/stormglass-service';
import { StormGlassResponseError } from '@src/modules/forecast/usecases/user-beach-forecast-processing/errors/stormglass-response-error';
import { Either, right } from '@src/shared/logic/either';

import fetchPointsNormalizedResponse from '../data/fetch-points-normalized-response.json';

export class StormGlassServiceMock implements IStormGlassService {
  public timesSendWasCalled = 0;

  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right(fetchPointsNormalizedResponse);
  }
}
