import { ForecastPoint } from "../ports/dtos/forecast-point";
import { StormGlassForecastResponse } from "../ports/dtos/stormglass-response";

export class StormGlassMapper {
  static toNormalize(data: StormGlassForecastResponse): ForecastPoint[] {
    return data.hours.filter((point) => (
      !!(
        point.time && 
        point.swellDirection?.['noaa'] && 
        point.swellHeight?.['noaa'] && 
        point.swellPeriod?.['noaa'] && 
        point.waveDirection?.['noaa'] && 
        point.waveHeight?.['noaa'] && 
        point.windDirection?.['noaa'] && 
        point.windSpeed?.['noaa']
      )
    )).map((point) => ({
        time: point.time,
        swellDirection: point.swellDirection['noaa'],
        swellHeight: point.swellHeight['noaa'],
        swellPeriod: point.swellPeriod['noaa'],
        waveDirection: point.waveDirection['noaa'],
        waveHeight: point.waveHeight['noaa'],
        windDirection: point.windDirection['noaa'],
        windSpeed: point.windSpeed['noaa']
    }))
  }
}
