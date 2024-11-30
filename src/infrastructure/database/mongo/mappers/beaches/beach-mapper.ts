import { Beach } from '@src/entities/beach/beach';
import { Latitude } from '@src/entities/beach/latitude';
import { Longitude } from '@src/entities/beach/longitude';
import { Name } from '@src/entities/beach/name';
import { Position } from '@src/entities/beach/position';

export class BeachMapper {
  static toDomain(raw): Beach[] {
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
