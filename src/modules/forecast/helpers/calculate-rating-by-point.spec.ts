import { BeachPosition } from '@config/constants/beach-position-enum';

import { calculateRatingByPoint } from './calculate-rating-by-point';

describe('Calculate rating by point helper', () => {
  const beach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: BeachPosition.E,
    userId: 'fake-user-id',
  };

  const defaultPoint = {
    swellDirection: 110,
    swellHeight: 0.1,
    swellPeriod: 5,
    time: 'test',
    waveDirection: 110,
    waveHeight: 0.1,
    windDirection: 100,
    windSpeed: 100,
  };

  it('should get a rating less than 1 for a poor point', () => {
    const rating = calculateRatingByPoint(defaultPoint, beach);

    expect(rating).toBe(1);
  });

  it('should get a rating of 1 for an ok point', () => {
    const pointData = {
      swellHeight: 0.4,
    };

    // using spread operator for cloning objects instead of Object.assign
    const point = { ...defaultPoint, ...pointData };

    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(1);
  });

  it('should get a rating of 3 for a point with offshore winds and a half overhead height', () => {
    const point = {
      ...defaultPoint,
      ...{
        swellHeight: 0.7,
        windDirection: 250,
      },
    };
    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(3);
  });

  it('should get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
    const point = {
      ...defaultPoint,
      ...{
        swellHeight: 0.7,
        swellPeriod: 12,
        windDirection: 250,
      },
    };
    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(4);
  });

  it('should get a rating of 4 for a point with offshore winds, shoulder high swell and good interval', () => {
    const point = {
      ...defaultPoint,
      ...{
        swellHeight: 1.5,
        swellPeriod: 12,
        windDirection: 250,
      },
    };
    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(4);
  });

  it('should get a rating of 5 classic day!', () => {
    const point = {
      ...defaultPoint,
      ...{
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 250,
      },
    };
    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(5);
  });

  it('should get a rating of 4 a good condition but with crossshore winds', () => {
    const point = {
      ...defaultPoint,
      ...{
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 130,
      },
    };
    const rating = calculateRatingByPoint(point, beach);

    expect(rating).toBe(4);
  });
});
