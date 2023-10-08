import { Name } from "../name";
import { Position } from "../position";
import { Latitude } from "../latitude";
import { Longitude } from "../longitude";

export interface IBeachProps {
  name: Name;
  position: Position;
  lat: Latitude;
  lng: Longitude;
}
