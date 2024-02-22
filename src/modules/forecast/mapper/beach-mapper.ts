import { Beach } from '../domain/beach/beach';
import { Latitude } from '../domain/beach/latitude';
import { Longitude } from '../domain/beach/longitude';
import { Name } from '../domain/beach/name';
import { Position } from '../domain/beach/position';
import { PersistenceBeachModel } from './dtos/beach-model';

export class BeachMapper {
  static toDomain(raw: PersistenceBeachModel[]): Beach[] {
    return raw.map(({ name, lat, lng, position, userId, id }) => {
      const nameOrError = Name.create(name);
      const latitudeOrError = Latitude.create(lat);
      const longitudeOrError = Longitude.create(lng);
      const positionOrError = Position.create(position);

      if (nameOrError.isLeft()) {
        throw new Error('Name value is invalid.');
      }

      if (latitudeOrError.isLeft()) {
        throw new Error('Latitude value is invalid.');
      }

      if (longitudeOrError.isLeft()) {
        throw new Error('Longitude value is invalid.');
      }

      if (positionOrError.isLeft()) {
        throw new Error('Position value is invalid.');
      }

      const beachOrError = Beach.create(
        {
          name: nameOrError.value,
          lat: latitudeOrError.value,
          lng: longitudeOrError.value,
          position: positionOrError.value,
          userId,
        },
        id,
      );

      if (beachOrError.isRight()) {
        return beachOrError.value;
      }

      return null;
    });
  }
}
