import { IFetchPointNormalize } from '@src/external/providers/stormglass-service/dtos/fetch-point-normalize';

import { IRegisterBeachDTO } from './register-beach';

export interface ICalculateRatingDTO {
  point: IFetchPointNormalize;
  beach: IRegisterBeachDTO;
}
