import { getRatingForSwellSize } from './get-rating-for-swell-size';

describe('getRatingForSwellSize', () => {
  it('should be able get rating 1 for less than ankle to knee high swell', () => {
    const rating = getRatingForSwellSize(0.2);

    expect(rating).toBe(1);
  });

  it('should be able get rating 2 for an ankle to knee swell', () => {
    const rating = getRatingForSwellSize(0.6);

    expect(rating).toBe(2);
  });

  it('should be able get rating 3 for waist high swell', () => {
    const rating = getRatingForSwellSize(1.5);

    expect(rating).toBe(3);
  });

  it('should be able get rating 5 overhead swell', () => {
    const rating = getRatingForSwellSize(2.5);

    expect(rating).toBe(5);
  });
});
