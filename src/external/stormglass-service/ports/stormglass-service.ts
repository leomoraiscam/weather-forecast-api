import { FetchPointCoordinate } from "./dtos/fetch-point-coordinate"
import { FetchPointNormalize } from "./dtos/fetch-point-normalize";

export interface StormGlassService {
  execute: (options: FetchPointCoordinate) => Promise<FetchPointNormalize[]>;
}
