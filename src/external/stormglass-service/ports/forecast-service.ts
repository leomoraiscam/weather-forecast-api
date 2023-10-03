import { ForecastCoordinates } from "./dtos/forecast-coordinates"
import { ForecastPoint } from "./dtos/forecast-point";

export interface ForecastService {
  fetchPoints: (options: ForecastCoordinates) => Promise<ForecastPoint[]>;
}
