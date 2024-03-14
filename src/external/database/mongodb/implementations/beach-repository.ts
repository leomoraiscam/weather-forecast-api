import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { Beach } from '@src/modules/forecast/domain/beach/beach';
import { IBeachCoordinatesDTO } from '@src/modules/forecast/dtos/beach-coordinates';
import { BeachMapper } from '@src/modules/forecast/mapper/beach-mapper';
import { IBeachRepository } from '@src/modules/forecast/repositories/ports/beach-repository';

export class BeachRepository implements IBeachRepository {
  async findByGeolocation({ lat, lng, userId }: IBeachCoordinatesDTO): Promise<Beach> {
    const beachCollection = mongoHelper.getCollection('beaches');

    const beach = await beachCollection.findOne<Beach>({ lat, lng, userId });

    if (!beach) {
      return null;
    }

    return beach;
  }

  async findAllBeachesByUser(userId: string): Promise<Beach[]> {
    const beachCollection = mongoHelper.getCollection('beaches');

    const data = await beachCollection.find({ userId }).toArray();

    const serializerBeach = data.map((beach) => ({
      id: beach.id,
      name: beach.name,
      lat: beach.lat,
      lng: beach.lng,
      position: beach.position,
      userId: beach.userId,
    }));

    return BeachMapper.toDomain(serializerBeach);
  }

  async create(beach: Beach): Promise<Beach> {
    const userCollection = mongoHelper.getCollection('beaches');

    const result = await this.findByGeolocation({
      lat: beach.lat.value,
      lng: beach.lng.value,
      userId: beach.userId,
    });

    if (!result) {
      await userCollection.insertOne({
        id: beach.id,
        name: beach.name.value,
        lat: beach.lat.value,
        lng: beach.lng.value,
        position: beach.position.value,
        userId: beach.userId,
      });
    }

    return result;
  }
}
