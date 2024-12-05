import { IBeachRepository } from '@src/application/contracts/repositories/beaches/beach-repository';
import { Beach } from '@src/entities/beach/beach';
import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { BeachMapper } from '@src/infrastructure/database/mongo/repositories/beaches/mappers/beach-mapper';
import { IBeachCoordinatesDTO } from '@src/modules/forecast/dtos/beach-coordinates';

export class BeachRepository implements IBeachRepository {
  async findByGeolocation(data: IBeachCoordinatesDTO): Promise<Beach> {
    const { lat, lng, userId } = data;
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
