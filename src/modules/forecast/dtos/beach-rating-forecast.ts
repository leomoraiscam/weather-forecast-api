import { IFetchPointNormalize } from '@src/external/stormglass-service/dtos/fetch-point-normalize';

import { IRegisterBeachDTO } from './register-beach';

export interface IBeachRatingForecast
  extends Omit<IRegisterBeachDTO, 'user'>,
    IFetchPointNormalize {
  rating: number;
}
