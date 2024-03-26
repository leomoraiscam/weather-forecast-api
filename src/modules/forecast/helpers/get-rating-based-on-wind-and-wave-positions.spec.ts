import { BeachPosition } from '@config/constants/beach-position-enum';

import { IRegisterBeachDTO } from '../dtos/register-beach';
import { getRatingBasedOnWindAndWavePositions } from './get-rating-based-on-wind-and-wave-positions';

let beach: IRegisterBeachDTO;

describe('Get rating based on wind and wave position helper', () => {
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
    const rating = getRatingBasedOnWindAndWavePositions({
      waveDirection: BeachPosition.E,
      windDirection: BeachPosition.E,
      beach,
    });

    expect(rating).toBe(1);
  });

  it('should be able to get rating 3 for a beach with cross winds', () => {
    const rating = getRatingBasedOnWindAndWavePositions({
      waveDirection: BeachPosition.E,
      windDirection: BeachPosition.S,
      beach,
    });

    expect(rating).toBe(3);
  });

  it('should be able to get rating 5 for a beach with offshore winds', () => {
    const rating = getRatingBasedOnWindAndWavePositions({
      waveDirection: BeachPosition.E,
      windDirection: BeachPosition.W,
      beach,
    });

    expect(rating).toBe(5);
  });
});
