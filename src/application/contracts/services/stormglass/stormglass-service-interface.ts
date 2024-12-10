import { IStormGlassIntegrationResponse as IStormGlassServiceOutput } from './dtos/stormglass-integration-response';
import { IStormGlassServiceInput } from './dtos/stormglass-service-input';

export interface IStormGlassService {
  execute: (input: IStormGlassServiceInput) => Promise<IStormGlassServiceOutput[]>;
}
