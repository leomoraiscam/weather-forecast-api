/* eslint-disable no-useless-constructor */
import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';
import { IBeach } from '@src/modules/forecast/dtos/beach';

import { getPositionFromLocation } from '../../helpers/get-position-from-location';
import { getRatingBasedOnWindAndWavePositions } from '../../helpers/get-rating-based-on-wind-and-wave-positions';
import { getRatingForSwellPeriod } from '../../helpers/get-rating-for-swell-period';
import { getRatingForSwellSize } from '../../helpers/get-rating-for-swell-size';

export class GetRatingByPointUseCase {
  constructor(private beach: IBeach) {}

  public execute(point: IFetchPointNormalize): number {
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
