import { IStormGlassIntegrationResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-integration-response';
import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';
import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';

export class StormGlassServicerErrorStub implements IStormGlassService {
  async execute(_: IStormGlassServiceInput): Promise<IStormGlassIntegrationResponse[]> {
    throw new StormGlassResponseError();
  }
}
