import { Beach } from "./beach";
import { FetchPointNormalize } from "@src/external/stormglass-service/dtos/fetch-point-normalize";

export interface ForecastRatingBeach extends Omit<Beach, 'user'>, FetchPointNormalize {
  rating: number,
}
