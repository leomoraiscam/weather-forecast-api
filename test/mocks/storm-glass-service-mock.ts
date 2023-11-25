import { IFetchPointCoordinate } from '../../src/external/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../../src/external/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '../../src/external/stormglass-service/ports/stormglass-service';
import { StormGlassResponseError } from '../../src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, right } from '../../src/shared/logic/Either';
import fetchPointsNormalizedResponse from '../fixtures/fetch-points-normalized-response.json';

export class StormGlassServiceMock implements IStormGlassService {
  public timesSendWasCalled = 0;

  public async execute({
    lat,
    lng,
  }: IFetchPointCoordinate): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return right(fetchPointsNormalizedResponse);
  }
}
