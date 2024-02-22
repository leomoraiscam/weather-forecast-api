/* eslint-disable no-restricted-syntax */
import { IBeachRatingForecastDTO } from '../dtos/beach-rating-forecast';
import { ITimeBeachRatingForecastDTO } from '../dtos/time-beach-rating-forecast';

export function normalizeForecastByTime(
  forecast: IBeachRatingForecastDTO[],
): ITimeBeachRatingForecastDTO[] {
  const forecastByTime: ITimeBeachRatingForecastDTO[] = [];

  for (const point of forecast) {
    const timePoint = forecastByTime.find((forecastData) => forecastData.time === point.time);

    if (timePoint) {
      timePoint.forecast.push(point);
    } else {
      forecastByTime.push({
        time: point.time,
        forecast: [point],
      });
    }
  }

  return forecastByTime;
}
