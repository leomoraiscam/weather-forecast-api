import { IBeachRepository } from '@src/application/contracts/repositories/beaches/beach-repository';
import { Beach } from '@src/entities/beach/beach';
import { IBeachCoordinatesDTO } from '@src/modules/forecast/dtos/beach-coordinates';
import { BeachMapper } from '@src/modules/forecast/mapper/beach-mapper';

export class InMemoryBeachRepository implements IBeachRepository {
  beaches: Beach[] = [];

  async findByGeolocation(data: IBeachCoordinatesDTO): Promise<Beach> {
    const { lat, lng, userId } = data;

    return this.beaches.find(
      (beach) => beach.lat.value === lat && beach.lng.value === lng && beach.userId === userId,
    );
  }

  async findAllBeachesByUser(userId: string): Promise<Beach[]> {
    const beaches = this.beaches.filter((beach) => beach.userId === userId);

    const serializerBeach = beaches.map((beach) => ({
      id: beach.id,
      name: beach.name.value,
      lat: beach.lat.value,
      lng: beach.lng.value,
      position: beach.position.value,
      userId: beach.userId,
    }));

    return BeachMapper.toDomain(serializerBeach) as any;
  }

  async create(beach: Beach): Promise<Beach> {
    this.beaches.push(beach);

    return beach;
  }
}
