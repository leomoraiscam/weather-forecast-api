import { BeachForecastPointDetails } from '../../dtos/beach-forecast-point-details';
import { RegisterBeachInput } from '../../dtos/register-beach-input';
import { getDirectionPosition } from './get-direction-position';
import { getRatingSwellPeriod } from './get-rating-swell-period';
import { getRatingSwellSize } from './get-rating-swell-size';
import { getRatingWindAndWave } from './get-rating-wind-and-wave';

export function getBeachForecastPointRatings(
  point: BeachForecastPointDetails,
  beach: Omit<RegisterBeachInput, 'userId'>,
) {
  const { swellDirection, windDirection, swellHeight, swellPeriod } = point;
  const swellDirectionPosition = getDirectionPosition(swellDirection);
  const windDirectionPosition = getDirectionPosition(windDirection);
  const windAndWaveRating = getRatingWindAndWave(
    swellDirectionPosition,
    windDirectionPosition,
    beach,
  );
  const swellHeightRating = getRatingSwellSize(swellHeight);
  const swellPeriodRating = getRatingSwellPeriod(swellPeriod);

  return {
    windAndWaveRating,
    swellHeightRating,
    swellPeriodRating,
  };
}
