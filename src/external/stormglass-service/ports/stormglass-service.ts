import { Either } from "@src/shared/logic/Either";
import { FetchPointCoordinate } from "../dtos/fetch-point-coordinate"
import { FetchPointNormalize } from "../dtos/fetch-point-normalize";
import { StormGlassResponseError } from "../../../modules/forecast/usecases/errors/stormglass-response-error";

export interface StormGlassService {
  execute: (options: FetchPointCoordinate) => Promise<Either<StormGlassResponseError, FetchPointNormalize[]>>;
}
