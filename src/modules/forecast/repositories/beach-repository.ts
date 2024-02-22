import { Beach } from '../domain/beach/beach';
import { IBeachCoordinatesDTO } from '../dtos/beach-coordinates';

export interface IBeachRepository {
  findByGeolocation(data: IBeachCoordinatesDTO): Promise<Beach | undefined>;
  findAllBeachesByUser(userId: string): Promise<Beach[] | undefined>;
  create(beach: Beach): Promise<Beach>;
}
