import { Beach } from "../domain/beach/beach";
import { BeachCoordinate } from "../dtos/beach-cordinate";

export interface IBeachRepository {
  create(beach: Beach): Promise<Beach>
  findByGeolocation(data: BeachCoordinate): Promise<Beach>
}