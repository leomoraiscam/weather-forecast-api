import { FetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { Beach } from '@src/modules/forecast/dtos/beach';
import { getPositionFromLocation } from '../../helpers/get-position-from-location';
import { getRatingBasedOnWindAndWavePositions } from '../../helpers/get-rating-based-on-wind-and-wave-positions';
import { getRatingForSwellSize } from '../../helpers/get-rating-for-swell-size';
import { getRatingForSwellPeriod } from '../../helpers/get-rating-for-swell-period';

export class GetRatingByPointUseCase {
  constructor(private beach: Beach) {}

  public execute(point: FetchPointNormalize): number {
    const swellDirection = getPositionFromLocation(point.swellDirection);
    const windDirection = getPositionFromLocation(point.windDirection);

    const windAndWaveRating = getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection,
      this.beach,
    );

    const swellHeight = getRatingForSwellSize(point.swellHeight);

    const swellPeriod = getRatingForSwellPeriod(point.swellPeriod);

    const rating = (windAndWaveRating + swellHeight + swellPeriod) / 3;

    return Math.round(rating);
  }
}
