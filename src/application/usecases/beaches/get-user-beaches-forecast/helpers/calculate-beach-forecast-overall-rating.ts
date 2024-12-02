import { RegisterBeachInput } from '../../register-beach/dtos/register-beach-input';
import { BeachForecastPointDetails } from '../dtos/beach-forecast-point-details';
import { getBeachForecastPointRatings } from './get-beach-forecast-point-ratings';

export function calculateBeachForecastOverallRating(
  point: BeachForecastPointDetails,
  beach: Omit<RegisterBeachInput, 'userId'>,
): number {
  const { windAndWaveRating, swellHeightRating, swellPeriodRating } = getBeachForecastPointRatings(
    point,
    beach,
  );

  const rating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

  return Math.round(rating);
}
