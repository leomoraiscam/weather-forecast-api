interface KeyPair {
  noaa: number;
}

interface IWeatherPointTimeResponse {
  swellDirection: KeyPair;
  swellHeight: KeyPair;
  swellPeriod: KeyPair;
  waveDirection: KeyPair;
  waveHeight: KeyPair;
  windDirection: KeyPair;
  windSpeed: KeyPair;
  time: string;
}

export interface IStormGlassAPIResponse {
  hours: IWeatherPointTimeResponse[];
}
