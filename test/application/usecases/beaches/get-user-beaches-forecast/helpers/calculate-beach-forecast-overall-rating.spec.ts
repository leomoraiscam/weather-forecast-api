import { BeachPosition } from '@src/shared/enums/beach-position-enum';
import { BeachForecastPointDetails } from '@src/application/usecases/beaches/dtos/beach-forecast-point-details';
import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { calculateBeachForecastOverallRating } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/calculate-beach-forecast-overall-rating';

describe('Calculate rating by point helper', () => {
  let beach: RegisterBeachInput;
  let forecastPoint: BeachForecastPointDetails;

  beforeEach(() => {
    beach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: BeachPosition.E,
      userId: 'fake-user-id',
    };

    forecastPoint = {
      swellDirection: 110,
      swellHeight: 0.1,
      swellPeriod: 5,
      time: 'test',
      waveDirection: 110,
      waveHeight: 0.1,
      windDirection: 100,
      windSpeed: 100,
    };
  });

  it('should be able to get a rating less than 1 for a poor point', () => {
    const rating = calculateBeachForecastOverallRating(forecastPoint, beach);

    expect(rating).toBe(1);
  });

  it('should be able to get a rating of 1 for an ok point', () => {
    const pointData = {
      swellHeight: 0.4,
    };

    const point = { ...forecastPoint, ...pointData };

    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(1);
  });

  it('should be able to get a rating of 3 for a point with offshore winds and a half overhead height', () => {
    const point = {
      ...forecastPoint,
      ...{
        swellHeight: 0.7,
        windDirection: 250,
      },
    };
    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(3);
  });

  it('should be able to get a rating of 4 for a point with offshore winds, half overhead high swell and good interval', () => {
    const point = {
      ...forecastPoint,
      ...{
        swellHeight: 0.7,
        swellPeriod: 12,
        windDirection: 250,
      },
    };
    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(4);
  });

  it('should be able to get a rating of 4 for a point with offshore winds, shoulder high swell and good interval', () => {
    const point = {
      ...forecastPoint,
      ...{
        swellHeight: 1.5,
        swellPeriod: 12,
        windDirection: 250,
      },
    };
    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(4);
  });

  it('should be able to get a rating of 5 classic day!', () => {
    const point = {
      ...forecastPoint,
      ...{
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 250,
      },
    };
    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(5);
  });

  it('should be able to get a rating of 4 a good condition but with crossshore winds', () => {
    const point = {
      ...forecastPoint,
      ...{
        swellHeight: 2.5,
        swellPeriod: 16,
        windDirection: 130,
      },
    };
    const rating = calculateBeachForecastOverallRating(point, beach);

    expect(rating).toBe(4);
  });
});
