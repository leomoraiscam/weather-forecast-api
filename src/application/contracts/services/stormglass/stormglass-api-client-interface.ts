import { IStormGlassAPIRequest } from './dtos/stormglass-api-request';
import { IStormGlassAPIResponse } from './dtos/stormglass-api-response';

export interface IStormGlassAPIClient {
  execute: (coordinates: IStormGlassAPIRequest) => Promise<IStormGlassAPIResponse>;
}
