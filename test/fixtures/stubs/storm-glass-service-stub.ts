import { IStormGlassServiceInput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-input';
import { IStormGlassServiceOutput } from '@src/application/contracts/services/stormglass/dtos/stormglass-service-output';
import { IStormGlassService } from '@src/application/contracts/services/stormglass/stormglass-service-interface';

import fetchPointsNormalizedResponse from '../data/fetch-points-normalized-response.json';

export class StormGlassServiceStub implements IStormGlassService {
  async execute(_: IStormGlassServiceInput): Promise<IStormGlassServiceOutput[]> {
    return fetchPointsNormalizedResponse;
  }
}
