import { IStormGlassAPIRequest } from './stormglass-api-request';

export interface IStormGlassServiceInput extends IStormGlassAPIRequest {
  userId: string;
  page: number;
  pageSize: number;
}
