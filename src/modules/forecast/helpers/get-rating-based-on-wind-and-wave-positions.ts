import { BeachPosition } from '@config/constants/beach-position-enum';

import { IWindWavesOffShoreDTO, IRatingByWindWavesDTO } from '../dtos/wind-waves-off-shore';

const isWindOffShore = ({
  waveDirection,
  windDirection,
  beach,
}: IWindWavesOffShoreDTO): boolean => {
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
};

export function getRatingBasedOnWindAndWavePositions({
  waveDirection,
  windDirection,
  beach,
}: IRatingByWindWavesDTO): number {
  if (waveDirection === windDirection) {
    return 1;
  }

  if (isWindOffShore({ beach, waveDirection, windDirection })) {
    return 5;
  }

  return 3;
}
