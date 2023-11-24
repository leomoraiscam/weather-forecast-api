import { IForecastRatingBeach } from './forecast-rating-beach';

export interface ITimeForecast {
  time: string;
  forecast: IForecastRatingBeach[];
}
