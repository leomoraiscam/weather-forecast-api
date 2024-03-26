import { BeachPosition } from '@config/constants/beach-position-enum';

import { IRegisterBeachDTO } from './register-beach';

export interface IWindWavesOffShoreDTO {
  beach: IRegisterBeachDTO;
  waveDirection: string;
  windDirection: string;
}

export interface IRatingByWindWavesDTO {
  beach: IRegisterBeachDTO;
  waveDirection: BeachPosition;
  windDirection: BeachPosition;
}
