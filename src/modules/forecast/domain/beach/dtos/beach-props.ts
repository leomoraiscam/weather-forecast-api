import { Latitude } from '../latitude';
import { Longitude } from '../longitude';
import { Name } from '../name';
import { Position } from '../position';

export interface IBeachProps {
  name: Name;
  lat: Latitude;
  lng: Longitude;
  position: Position;
  userId: string;
}
