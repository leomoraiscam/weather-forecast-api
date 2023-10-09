import { BeachPosition } from "@config/constants/beach-position-enum";
import { FetchPointNormalize } from "@src/external/stormglass-service/ports/dtos/fetch-point-normalize";

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, FetchPointNormalize {}

