import { BeachPosition } from '@config/constants/beach-position-enum';
import { getRatingForSwellPeriod } from './get-rating-for-swell-period';

describe('getRatingForSwellPeriod', () => {
  const beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    userId: 'fake-user-id',
  };

  it('should be able get rating 1 for a period of 5 seconds', () => {
    const rating = getRatingForSwellPeriod(5);

    expect(rating).toBe(1);
  });

  it('should be able get rating 2 for a period of 9 seconds', () => {
    const rating = getRatingForSwellPeriod(9);

    expect(rating).toBe(2);
  });

  it('should be able get rating 4 for a period of 12 seconds', () => {
    const rating = getRatingForSwellPeriod(12);

    expect(rating).toBe(4);
  });

  it('should be able get rating 5 for a period of 16 seconds', () => {
    const rating = getRatingForSwellPeriod(16);

    expect(rating).toBe(5);
  });
});
