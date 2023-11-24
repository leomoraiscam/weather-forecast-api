interface IStormGlassPointSource {
  [key: string]: number;
}

interface IStormGlassPoint {
  time: string;
  swellDirection: IStormGlassPointSource;
  swellHeight: IStormGlassPointSource;
  swellPeriod: IStormGlassPointSource;
  waveDirection: IStormGlassPointSource;
  waveHeight: IStormGlassPointSource;
  windDirection: IStormGlassPointSource;
  windSpeed: IStormGlassPointSource;
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[];
}
