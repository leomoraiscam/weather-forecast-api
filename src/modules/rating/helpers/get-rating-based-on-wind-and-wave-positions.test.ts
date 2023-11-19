import { BeachPosition } from '@config/constants/beach-position-enum';
import { getRatingBasedOnWindAndWavePositions } from './get-rating-based-on-wind-and-wave-positions';

describe('GetRatingBasedOnWindAndWavePositions', () => {
  const beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    userId: 'fake-user-id',
  };

  it('should be able get rating 1 for a beach with onshore winds', () => {
    const rating = getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.E, beach);

    expect(rating).toBe(1);
  });

  it('should be able get rating 3 for a beach with cross winds', () => {
    const rating = getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.S, beach);

    expect(rating).toBe(3);
  });

  it('should be able get rating 5 for a beach with offshore winds', () => {
    const rating = getRatingBasedOnWindAndWavePositions(BeachPosition.E, BeachPosition.W, beach);

    expect(rating).toBe(5);
  });
});
