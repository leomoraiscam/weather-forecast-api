import { FetchPointNormalize } from "../dtos/fetch-point-normalize";
import { StormGlassForecastResponse } from "../dtos/stormglass-response";

export class StormGlassMapper {
  static toNormalize(data: StormGlassForecastResponse): FetchPointNormalize[] {
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
