/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import { BeachPosition } from '@config/constants/beach-position-enum';

export function getRatingBasedOnWindAndWavePositions(
  waveDirection: BeachPosition,
  windDirection: BeachPosition,
  beach: any,
): number {
  if (waveDirection === windDirection) {
    return 1;
  }
  if (isWindOffShore(beach, waveDirection, windDirection)) {
    return 5;
  }

  return 3;
}

function isWindOffShore(beach: any, waveDirection: string, windDirection: string): boolean {
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
