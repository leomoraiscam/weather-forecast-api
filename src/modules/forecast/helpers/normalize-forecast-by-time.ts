import { IBeachRatingForecastDTO } from '../dtos/beach-rating-forecast';
import { ITimeBeachRatingForecastDTO } from '../dtos/time-beach-rating-forecast';

export function normalizeForecastByTime(
  forecast: IBeachRatingForecastDTO[],
): ITimeBeachRatingForecastDTO[] {
  const forecastByTime: { [time: string]: ITimeBeachRatingForecastDTO } = {};

  for (const point of forecast) {
    if (!forecastByTime[point.time]) {
      forecastByTime[point.time] = { time: point.time, forecast: [] };
    }

    forecastByTime[point.time].forecast.push(point);
  }

  return Object.values(forecastByTime);
}
