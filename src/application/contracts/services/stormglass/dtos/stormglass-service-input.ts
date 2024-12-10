import { IStormGlassIntegrationRequest } from './stormglass-integration-request';

export interface IStormGlassServiceInput extends IStormGlassIntegrationRequest {
  userId: string;
  page: number;
  pageSize: number;
}
