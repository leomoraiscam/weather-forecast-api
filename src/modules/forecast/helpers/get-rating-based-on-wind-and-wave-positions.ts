import { BeachPosition } from '@config/constants/beach-position-enum';

import { IRegisterBeachDTO } from '../dtos/register-beach';

function isWindOffShore(
  beach: IRegisterBeachDTO,
  waveDirection: string,
  windDirection: string,
): boolean {
  return (
    (waveDirection === BeachPosition.N &&
      windDirection === BeachPosition.S &&
      beach.position === BeachPosition.N) ||
    (waveDirection === BeachPosition.S &&
      windDirection === BeachPosition.N &&
      beach.position === BeachPosition.S) ||
    (waveDirection === BeachPosition.E &&
      windDirection === BeachPosition.W &&
      beach.position === BeachPosition.E) ||
    (waveDirection === BeachPosition.W &&
      windDirection === BeachPosition.E &&
      beach.position === BeachPosition.W)
  );
}

export function getRatingBasedOnWindAndWavePositions(
  waveDirection: BeachPosition,
  windDirection: BeachPosition,
  beach: IRegisterBeachDTO,
): number {
  if (waveDirection === windDirection) {
    return 1;
  }

  if (isWindOffShore(beach, waveDirection, windDirection)) {
    return 5;
  }

  return 3;
}
