import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IBeach } from '@src/modules/forecast/dtos/beach';

import { getPositionFromLocation } from './get-position-from-location';
import { getRatingBasedOnWindAndWavePositions } from './get-rating-based-on-wind-and-wave-positions';
import { getRatingForSwellPeriod } from './get-rating-for-swell-period';
import { getRatingForSwellSize } from './get-rating-for-swell-size';

export function calculateRatingByPoint(point: IFetchPointNormalize, beach: IBeach) {
  const { swellDirection, windDirection, swellHeight, swellPeriod } = point;

  const swellDirectionPosition = getPositionFromLocation(swellDirection);
  const windDirectionPosition = getPositionFromLocation(windDirection);

  const windAndWaveRating = getRatingBasedOnWindAndWavePositions(
    swellDirectionPosition,
    windDirectionPosition,
    beach,
  );

  const swellHeightRating = getRatingForSwellSize(swellHeight);

  const swellPeriodRating = getRatingForSwellPeriod(swellPeriod);

  const rating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;

  return Math.round(rating);
}
