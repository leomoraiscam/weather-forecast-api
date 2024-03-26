import { IFetchPointNormalize } from '@src/external/services/stormglass-service/dtos/fetch-point-normalize';

import { IRegisterBeachDTO } from './register-beach';

export interface ICalculateRatingDTO {
  point: IFetchPointNormalize;
  beach: IRegisterBeachDTO;
}
