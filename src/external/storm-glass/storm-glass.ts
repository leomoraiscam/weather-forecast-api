import { AxiosStatic } from "axios";

export class StormGlass {
  constructor(protected request: AxiosStatic) {}
 
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly stormGlassAPISource = 'noaa';

  public async fetchPoints(lat: number, long: number): Promise<{}> {
    const response = await this.request.get(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&lat=${lat}&lng=${long}`,
    {
      headers: {
        Authorization: 'fake-token',
      },
    });

    return response;
  }
}