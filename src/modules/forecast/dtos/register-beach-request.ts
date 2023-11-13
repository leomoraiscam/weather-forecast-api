import { BeachPosition } from "@config/constants/beach-position-enum";

export interface RegisterBeachRequest {
  name: string;
  lat: number;
  lng: number;
  position: BeachPosition
}