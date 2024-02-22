import { IBeachRatingForecast } from './beach-rating-forecast';

export interface ITimeBeachRatingForecastDTO {
  time: string;
  forecast: IBeachRatingForecast[];
}
