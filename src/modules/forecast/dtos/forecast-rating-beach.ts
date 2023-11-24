import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';

import { IBeach } from './beach';

export interface IForecastRatingBeach extends Omit<IBeach, 'user'>, IFetchPointNormalize {
  rating: number;
}
