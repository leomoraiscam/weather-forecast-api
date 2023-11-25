import { BeachPosition } from '../../src/config/constants/beach-position-enum';
import { Beach } from '../../src/modules/forecast/domain/beach/beach';
import { Latitude } from '../../src/modules/forecast/domain/beach/latitude';
import { Longitude } from '../../src/modules/forecast/domain/beach/longitude';
import { Name } from '../../src/modules/forecast/domain/beach/name';
import { Position } from '../../src/modules/forecast/domain/beach/position';

type BeachOverrides = {
  name?: string;
  lat?: number;
  lng?: number;
  position?: string;
  userId?: string;
};

export function createBeach(overrides?: BeachOverrides) {
  const name = Name.create(overrides?.name ?? 'Dee Why').value as Name;
  const lat = Latitude.create(overrides?.lat ?? -33.792726).value as Latitude;
  const lng = Longitude.create(overrides?.lng ?? 141.289824).value as Longitude;
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
