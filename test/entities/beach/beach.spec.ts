import { BeachPosition } from '@config/constants/beach-position-enum';
import { Beach } from '@src/entities/beach/beach';
import { Latitude } from '@src/entities/beach/latitude';
import { Longitude } from '@src/entities/beach/longitude';
import { Name } from '@src/entities/beach/name';
import { Position } from '@src/entities/beach/position';

describe('Beach domain entity', () => {
  it('should be able to create new beach', () => {
    const name = Name.create('Dee Why').value as Name;
    const lat = Latitude.create(-33.792726).value as Latitude;
    const lng = Longitude.create(151.289824).value as Longitude;
    const position = Position.create(BeachPosition.S).value as Position;

    const beach = Beach.create({
      name,
      lat,
      lng,
      position,
      userId: 'fake-user-id',
    });

    expect(beach.isRight()).toBeTruthy();
  });
});
