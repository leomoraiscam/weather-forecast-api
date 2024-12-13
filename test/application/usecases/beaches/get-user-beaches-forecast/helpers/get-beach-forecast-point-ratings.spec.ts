import { BeachPosition } from '@src/shared/enums/beach-position-enum';
import { BeachForecastPointDetails } from '@src/application/usecases/beaches/dtos/beach-forecast-point-details';
import { RegisterBeachInput } from '@src/application/usecases/beaches/dtos/register-beach-input';
import { getBeachForecastPointRatings } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-beach-forecast-point-ratings';
import { getDirectionPosition } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-direction-position';
import { getRatingSwellPeriod } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-swell-period';
import { getRatingSwellSize } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-swell-size';
import { getRatingWindAndWave } from '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-wind-and-wave';

jest.mock(
  '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-direction-position',
);
jest.mock(
  '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-wind-and-wave',
);
jest.mock(
  '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-swell-size',
);
jest.mock(
  '@src/application/usecases/beaches/get-user-beaches-forecast/helpers/get-rating-swell-period',
);

describe('getBeachForecastPointRatings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate ratings correctly based on inputs', () => {
    const point: BeachForecastPointDetails = {
      time: '2024-12-01T00:00:00Z',
      swellDirection: 120,
      swellHeight: 1.5,
      swellPeriod: 10,
      waveDirection: 90,
      waveHeight: 2.0,
      windDirection: 45,
      windSpeed: 5,
    };

    const beach: Omit<RegisterBeachInput, 'userId'> = {
      name: 'Beach A',
      lat: -23.456,
      lng: -45.123,
      position: BeachPosition.E,
    };

    (getDirectionPosition as jest.Mock).mockReturnValueOnce('N').mockReturnValueOnce('S');
    (getRatingWindAndWave as jest.Mock).mockReturnValueOnce(4);
    (getRatingSwellSize as jest.Mock).mockReturnValueOnce(5);
    (getRatingSwellPeriod as jest.Mock).mockReturnValueOnce(3);

    const result = getBeachForecastPointRatings(point, beach);

    expect(getDirectionPosition).toHaveBeenCalledTimes(2);
    expect(getDirectionPosition).toHaveBeenCalledWith(120);
    expect(getDirectionPosition).toHaveBeenCalledWith(45);
    expect(getRatingWindAndWave).toHaveBeenCalledWith('N', 'S', beach);
    expect(getRatingSwellSize).toHaveBeenCalledWith(1.5);
    expect(getRatingSwellPeriod).toHaveBeenCalledWith(10);

    expect(result).toEqual({
      windAndWaveRating: 4,
      swellHeightRating: 5,
      swellPeriodRating: 3,
    });
  });

  it('should handle edge cases with minimum inputs', () => {
    const point: BeachForecastPointDetails = {
      time: '2024-12-01T00:00:00Z',
      swellDirection: 0,
      swellHeight: 0,
      swellPeriod: 0,
      waveDirection: 0,
      waveHeight: 0,
      windDirection: 0,
      windSpeed: 0,
    };

    const beach: Omit<RegisterBeachInput, 'userId'> = {
      name: 'Beach B',
      lat: 0,
      lng: 0,
      position: BeachPosition.N,
    };

    (getDirectionPosition as jest.Mock).mockReturnValueOnce('E').mockReturnValueOnce('W');
    (getRatingWindAndWave as jest.Mock).mockReturnValueOnce(1);
    (getRatingSwellSize as jest.Mock).mockReturnValueOnce(2);
    (getRatingSwellPeriod as jest.Mock).mockReturnValueOnce(1);

    const result = getBeachForecastPointRatings(point, beach);

    expect(getDirectionPosition).toHaveBeenCalledTimes(2);
    expect(getDirectionPosition).toHaveBeenCalledWith(0);
    expect(getDirectionPosition).toHaveBeenCalledWith(0);
    expect(getRatingWindAndWave).toHaveBeenCalledWith('E', 'W', beach);
    expect(getRatingSwellSize).toHaveBeenCalledWith(0);
    expect(getRatingSwellPeriod).toHaveBeenCalledWith(0);

    expect(result).toEqual({
      windAndWaveRating: 1,
      swellHeightRating: 2,
      swellPeriodRating: 1,
    });
  });

  it('should handle unexpected input gracefully', () => {
    const point: BeachForecastPointDetails = {
      time: '2024-12-01T00:00:00Z',
      swellDirection: NaN,
      swellHeight: -1,
      swellPeriod: NaN,
      waveDirection: NaN,
      waveHeight: NaN,
      windDirection: NaN,
      windSpeed: NaN,
    };

    const beach: Omit<RegisterBeachInput, 'userId'> = {
      name: 'Beach C',
      lat: NaN,
      lng: NaN,
      position: BeachPosition.S,
    };

    (getDirectionPosition as jest.Mock)
      .mockReturnValueOnce('Invalid')
      .mockReturnValueOnce('Invalid');
    (getRatingWindAndWave as jest.Mock).mockReturnValueOnce(0);
    (getRatingSwellSize as jest.Mock).mockReturnValueOnce(0);
    (getRatingSwellPeriod as jest.Mock).mockReturnValueOnce(0);

    const result = getBeachForecastPointRatings(point, beach);

    expect(getDirectionPosition).toHaveBeenCalledTimes(2);
    expect(getDirectionPosition).toHaveBeenCalledWith(NaN);
    expect(getDirectionPosition).toHaveBeenCalledWith(NaN);
    expect(getRatingWindAndWave).toHaveBeenCalledWith('Invalid', 'Invalid', beach);
    expect(getRatingSwellSize).toHaveBeenCalledWith(-1);
    expect(getRatingSwellPeriod).toHaveBeenCalledWith(NaN);

    expect(result).toEqual({
      windAndWaveRating: 0,
      swellHeightRating: 0,
      swellPeriodRating: 0,
    });
  });
});
