import { BeachPosition } from '@config/constants/beach-position-enum';

export interface RegisterBeachInput {
  name: string;
  lat: number;
  lng: number;
  position: BeachPosition;
  userId?: string;
}
