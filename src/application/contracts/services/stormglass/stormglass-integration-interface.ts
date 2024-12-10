import { IStormGlassAPIIntegrationResponse } from './dtos/stormglass-api-integration-response';
import { IStormGlassIntegrationRequest } from './dtos/stormglass-integration-request';

export interface IStormGlassIntegrationsService {
  execute: (
    coordinates: IStormGlassIntegrationRequest,
  ) => Promise<IStormGlassAPIIntegrationResponse>;
}
