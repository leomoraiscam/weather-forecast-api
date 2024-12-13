import { IStormGlassIntegrationResponse } from '@src/application/contracts/services/stormglass/dtos/stormglass-integration-response';
import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';

import fetchPointsNormalizedResponse from '../data/fetch-points-normalized-response.json';

export class StormGlassServiceMock implements IStormGlassService {
  public timesSendWasCalled = 0;

  async execute(_: IStormGlassServiceInput): Promise<IStormGlassIntegrationResponse[]> {
    return fetchPointsNormalizedResponse;
  }
}
