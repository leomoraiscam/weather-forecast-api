import { BeachPosition } from '@src/shared/enums/beach-position-enum';

export interface IRegisterBeachDTO {
  name: string;
  position?: BeachPosition;
  lat: number;
  lng: number;
  userId?: string;
}
