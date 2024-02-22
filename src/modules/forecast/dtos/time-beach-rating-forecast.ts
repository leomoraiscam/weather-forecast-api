import { IBeachRatingForecastDTO } from './beach-rating-forecast';

export interface ITimeBeachRatingForecastDTO {
  time: string;
  forecast: IBeachRatingForecastDTO[];
}
