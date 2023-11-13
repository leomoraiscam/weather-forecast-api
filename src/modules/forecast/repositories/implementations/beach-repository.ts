import { Beach } from '../../domain/beach/beach';
import { BeachCoordinate } from '../../dtos/beach-cordinate';
import { IBeachRepository } from '../beaches-repository';

import { mongoHelper } from '@src/external/repositories/mongodb/helpers/mongo-helper';

export class BeachRepository implements IBeachRepository {
  async findByGeolocation({ lat, lng }: BeachCoordinate): Promise<Beach> {
    const beachCollection = mongoHelper.getCollection('beaches');

    const beach = await beachCollection.findOne<Beach>({ lat, lng });

    if (!beach) {
      return null
    }

    return beach
  }

  async create(beach: Beach): Promise<Beach> {
    const userCollection = mongoHelper.getCollection('beaches');
    const result = await this.findByGeolocation({
      lat: beach.lat.value,
      lng: beach.lng.value
    });

    if (!result) {
      await userCollection.insertOne({
        id: beach.id,
        name: beach.name,
        lat: beach.lat.value,
        lng: beach.lng.value,
        position: beach.position.value
      });
    }

    return result
  }
}
