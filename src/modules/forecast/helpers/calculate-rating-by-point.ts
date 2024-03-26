import { ICalculateRatingDTO } from '../dtos/calculate-rating';
import { getPositionFromLocation } from './get-position-from-location';
import { getRatingBasedOnWindAndWavePositions } from './get-rating-based-on-wind-and-wave-positions';
import { getRatingForSwellPeriod } from './get-rating-for-swell-period';
import { getRatingForSwellSize } from './get-rating-for-swell-size';

export function calculateRatingByPoint({ point, beach }: ICalculateRatingDTO): number {
  const { swellDirection, windDirection, swellHeight, swellPeriod } = point;

  const swellDirectionPosition = getPositionFromLocation(swellDirection);
  const windDirectionPosition = getPositionFromLocation(windDirection);

  const windAndWaveRating = getRatingBasedOnWindAndWavePositions({
    waveDirection: swellDirectionPosition,
    windDirection: windDirectionPosition,
    beach,
  });

  const swellHeightRating = getRatingForSwellSize(swellHeight);
  const swellPeriodRating = getRatingForSwellPeriod(swellPeriod);

  const rating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

  return Math.round(rating);
}
