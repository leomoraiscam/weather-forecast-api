import { BeachPosition } from '@config/constants/beach-position-enum';

const isWindOffShore = (waveDirection, windDirection, beach): boolean => {
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

export function getRatingWindAndWave(waveDirection, windDirection, beach): number {
  if (waveDirection === windDirection) {
    return 1;
  }

  if (isWindOffShore(waveDirection, windDirection, beach)) {
    return 5;
  }

  return 3;
}
