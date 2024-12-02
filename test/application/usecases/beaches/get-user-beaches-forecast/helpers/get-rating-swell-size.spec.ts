import { getRatingSwellSize } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-swell-size';

describe('Get rating for swell size helper', () => {
  it('should be able to get rating 1 for less than ankle to knee high swell', () => {
    const rating = getRatingSwellSize(0.2);

    expect(rating).toBe(1);
  });

  it('should be able to get rating 2 for an ankle to knee swell', () => {
    const rating = getRatingSwellSize(0.6);

    expect(rating).toBe(2);
  });

  it('should be able to get rating 3 for waist high swell', () => {
    const rating = getRatingSwellSize(1.5);

    expect(rating).toBe(3);
  });

  it('should be able to get rating 5 overhead swell', () => {
    const rating = getRatingSwellSize(2.5);

    expect(rating).toBe(5);
  });
});
