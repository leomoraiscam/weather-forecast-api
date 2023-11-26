import { BeachPosition } from '@config/constants/beach-position-enum';

export interface IBeach {
  name: string;
  position?: BeachPosition;
  lat: number;
  lng: number;
  userId?: string;
}
