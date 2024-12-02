import { BeachPosition } from '@config/constants/beach-position-enum';
import { BeachForecastWithRating } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/beach-forecast-with-rating';
import { TimeGroupedBeachForecast } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/timed-grouped-beach-forecast';
import { groupForecastByTime } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/group-forecast-by-time';

describe('groupForecastByTime', () => {
  it('should group forecasts by time', () => {
    const input: BeachForecastWithRating[] = [
      {
        time: '2024-12-01T00:00:00Z',
        swellDirection: 120,
        swellHeight: 1.5,
        swellPeriod: 10,
        waveDirection: 90,
        waveHeight: 2.0,
        windDirection: 45,
        windSpeed: 5,
        rating: 4,
        name: 'Beach A',
        lat: -23.456,
        lng: -45.123,
        position: BeachPosition.E,
      },
      {
        time: '2024-12-01T00:00:00Z',
        swellDirection: 110,
        swellHeight: 1.2,
        swellPeriod: 12,
        waveDirection: 80,
        waveHeight: 1.8,
        windDirection: 30,
        windSpeed: 6,
        rating: 5,
        name: 'Beach B',
        lat: -24.456,
        lng: -46.123,
        position: BeachPosition.W,
      },
      {
        time: '2024-12-01T01:00:00Z',
        swellDirection: 100,
        swellHeight: 1.0,
        swellPeriod: 11,
        waveDirection: 70,
        waveHeight: 1.7,
        windDirection: 50,
        windSpeed: 7,
        rating: 3,
        name: 'Beach C',
        lat: -25.456,
        lng: -47.123,
        position: BeachPosition.N,
      },
    ];

    const expected: TimeGroupedBeachForecast[] = [
      {
        time: '2024-12-01T00:00:00Z',
        forecast: [input[0], input[1]],
      },
      {
        time: '2024-12-01T01:00:00Z',
        forecast: [input[2]],
      },
    ];

    const result = groupForecastByTime(input);
    expect(result).toEqual(expected);
  });

  it('should return an empty array when input is empty', () => {
    const input: BeachForecastWithRating[] = [];
    const result = groupForecastByTime(input);
    expect(result).toEqual([]);
  });

  it('should handle forecasts with a single time point', () => {
    const input: BeachForecastWithRating[] = [
      {
        time: '2024-12-01T00:00:00Z',
        swellDirection: 120,
        swellHeight: 1.5,
        swellPeriod: 10,
        waveDirection: 90,
        waveHeight: 2.0,
        windDirection: 45,
        windSpeed: 5,
        rating: 4,
        name: 'Beach A',
        lat: -23.456,
        lng: -45.123,
        position: BeachPosition.E,
      },
    ];

    const expected: TimeGroupedBeachForecast[] = [
      {
        time: '2024-12-01T00:00:00Z',
        forecast: [input[0]],
      },
    ];

    const result = groupForecastByTime(input);
    expect(result).toEqual(expected);
  });

  it('should handle multiple forecasts for the same time', () => {
    const input: BeachForecastWithRating[] = [
      {
        time: '2024-12-01T00:00:00Z',
        swellDirection: 120,
        swellHeight: 1.5,
        swellPeriod: 10,
        waveDirection: 90,
        waveHeight: 2.0,
        windDirection: 45,
        windSpeed: 5,
        rating: 4,
        name: 'Beach A',
        lat: -23.456,
        lng: -45.123,
        position: BeachPosition.E,
      },
      {
        time: '2024-12-01T00:00:00Z',
        swellDirection: 110,
        swellHeight: 1.2,
        swellPeriod: 12,
        waveDirection: 80,
        waveHeight: 1.8,
        windDirection: 30,
        windSpeed: 6,
        rating: 5,
        name: 'Beach B',
        lat: -24.456,
        lng: -46.123,
        position: BeachPosition.W,
      },
    ];

    const expected: TimeGroupedBeachForecast[] = [
      {
        time: '2024-12-01T00:00:00Z',
        forecast: [input[0], input[1]],
      },
    ];

    const result = groupForecastByTime(input);
    expect(result).toEqual(expected);
  });
});
