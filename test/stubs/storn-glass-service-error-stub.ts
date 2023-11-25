import { IFetchPointCoordinate } from '../../src/external/stormglass-service/dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../../src/external/stormglass-service/dtos/fetch-point-normalize';
import { IStormGlassService } from '../../src/external/stormglass-service/ports/stormglass-service';
import { StormGlassResponseError } from '../../src/modules/forecast/usecases/process-forecast-for-beaches/errors/stormglass-response-error';
import { Either, left } from '../../src/shared/logic/Either';

export class StormGlassServicerErrorStub implements IStormGlassService {
  public async execute(
    _: IFetchPointCoordinate,
  ): Promise<Either<StormGlassResponseError, IFetchPointNormalize[]>> {
    return left(new StormGlassResponseError('Error fetching data'));
  }
}
