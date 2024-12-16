import { IStormGlassServiceInput } from './dtos/stormglass-service-input';
import { IStormGlassServiceOutput } from './dtos/stormglass-service-output';

export interface IStormGlassService {
  execute: (input: IStormGlassServiceInput) => Promise<IStormGlassServiceOutput[]>;
}
