import { Beach } from '../domain/beach/beach';
import { IBeachCoordinate } from '../dtos/beach-cordinate';

export interface IBeachRepository {
  create(beach: Beach): Promise<Beach>;
  findByGeolocation(data: IBeachCoordinate): Promise<Beach>;
  findAllBeachesByUser(userId: string): Promise<Beach[]>;
}
