import { WAVE_HEIGHTS } from '@src/application/usecases/beaches/constants/waves-height';

export function getRatingSwellSize(height: number): number {
  if (height < WAVE_HEIGHTS.ankleToKnee.min) return 1;

  if (height < WAVE_HEIGHTS.ankleToKnee.max) return 2;

  if (height < WAVE_HEIGHTS.waistHigh.max) return 3;

  return 5;
}
