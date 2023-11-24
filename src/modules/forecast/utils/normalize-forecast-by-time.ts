/* eslint-disable no-restricted-syntax */
import { IForecastRatingBeach } from '../dtos/forecast-rating-beach';
import { ITimeForecast } from '../dtos/time-forecast';

export function normalizeForecastByTime(forecast: IForecastRatingBeach[]): ITimeForecast[] {
  const forecastByTime: ITimeForecast[] = [];

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
