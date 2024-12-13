import { BeachPosition } from '@src/shared/enums/beach-position-enum';

export interface RegisterBeachInput {
  name: string;
  lat: number;
  lng: number;
  position: BeachPosition;
  userId?: string;
}
