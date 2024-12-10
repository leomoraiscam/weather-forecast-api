interface KeyPair {
  noaa: number;
}

interface IStormGlassAPIWeatherPointTimeResponse {
  swellDirection: KeyPair;
  swellHeight: KeyPair;
  swellPeriod: KeyPair;
  waveDirection: KeyPair;
  waveHeight: KeyPair;
  windDirection: KeyPair;
  windSpeed: KeyPair;
  time: string;
}

export interface IStormGlassAPIIntegrationResponse {
  hours: IStormGlassAPIWeatherPointTimeResponse[];
}
