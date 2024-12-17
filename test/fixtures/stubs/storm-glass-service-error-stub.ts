import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassServiceOutput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-output';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';
import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';

export class StormGlassServicerErrorStub implements IStormGlassService {
  async execute(_: IStormGlassServiceInput): Promise<IStormGlassServiceOutput[]> {
    throw new StormGlassResponseError();
  }
}
