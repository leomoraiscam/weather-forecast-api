import { Beach } from '@src/entities/beach/beach';
import { Latitude } from '@src/entities/beach/latitude';
import { Longitude } from '@src/entities/beach/longitude';
import { Name } from '@src/entities/beach/name';
import { Position } from '@src/entities/beach/position';
import { BeachPosition } from '@src/shared/enums/beach-position-enum';

type BeachOverrides = {
  name?: string;
  lat?: number;
  lng?: number;
  position?: string;
  userId?: string;
};

export function createBeach(overrides?: BeachOverrides) {
  const name = Name.create(overrides?.name ?? 'Dee Why').value as Name;
  const lat = Latitude.create(overrides?.lat ?? -33.750919).value as Latitude;
  const lng = Longitude.create(overrides?.lng ?? 151.299059).value as Longitude;
  const position = Position.create(overrides?.position ?? BeachPosition.S).value as Position;
  const userId = overrides?.userId ?? 'fake-user-id';

  const beach = Beach.create({
    name,
    lat,
    lng,
    position,
    userId,
  });

  return beach.value as Beach;
}
