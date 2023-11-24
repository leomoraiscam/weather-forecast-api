import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IBeach } from '@src/modules/forecast/dtos/beach';
import { getPositionFromLocation } from '@src/modules/rating/helpers/get-position-from-location';
import { getRatingBasedOnWindAndWavePositions } from '@src/modules/rating/helpers/get-rating-based-on-wind-and-wave-positions';
import { getRatingForSwellPeriod } from '@src/modules/rating/helpers/get-rating-for-swell-period';
import { getRatingForSwellSize } from '@src/modules/rating/helpers/get-rating-for-swell-size';

export function calculateRatingByPoint(point: IFetchPointNormalize, beach: IBeach) {
  const swellDirection = getPositionFromLocation(point.swellDirection);
  const windDirection = getPositionFromLocation(point.windDirection);

  const windAndWaveRating = getRatingBasedOnWindAndWavePositions(
    swellDirection,
    windDirection,
    beach,
  );

  const swellHeight = getRatingForSwellSize(point.swellHeight);

  const swellPeriod = getRatingForSwellPeriod(point.swellPeriod);

  const rating = (windAndWaveRating + swellHeight + swellPeriod) / 3;

  return Math.round(rating);
}
