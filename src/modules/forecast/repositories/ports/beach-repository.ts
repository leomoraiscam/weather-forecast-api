import { Beach } from '@src/modules/forecast/domain/beach/beach';
import { IBeachCoordinatesDTO } from '@src/modules/forecast/dtos/beach-coordinates';

export interface IBeachRepository {
  findByGeolocation(data: IBeachCoordinatesDTO): Promise<Beach | null>;
  findAllBeachesByUser(userId: string): Promise<Beach[] | null>;
  create(beach: Beach): Promise<Beach>;
}
