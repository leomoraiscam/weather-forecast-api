import { BeachPosition } from '@config/constants/beach-position-enum';

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  userId?: string;
}
