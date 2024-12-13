import { BeachPosition } from '@src/shared/enums/beach-position-enum';
import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { getRatingWindAndWave } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-wind-and-wave';

describe('Get rating based on wind and wave position helper', () => {
  let beach: RegisterBeachInput;

  beforeEach(() => {
    beach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      userId: 'fake-user-id',
    };
  });

  it('should be able to get rating 1 for a beach with onshore winds', () => {
    const rating = getRatingWindAndWave(BeachPosition.E, BeachPosition.E, beach);

    expect(rating).toBe(1);
  });

  it('should be able to get rating 3 for a beach with cross winds', () => {
    const rating = getRatingWindAndWave(BeachPosition.E, BeachPosition.S, beach);

    expect(rating).toBe(3);
  });

  it('should be able to get rating 5 for a beach with offshore winds', () => {
    const rating = getRatingWindAndWave(BeachPosition.E, BeachPosition.W, beach);

    expect(rating).toBe(5);
  });
});
