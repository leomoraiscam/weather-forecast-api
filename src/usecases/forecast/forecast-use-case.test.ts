import { StormGlassService } from "@src/external/stormglass-service/stormglass-service"
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import { Beach, BeachPosition, ForecastUseCase } from "./forecast-use-case";

jest.mock("@src/external/stormglass-service/stormglass-service.ts")

describe('Forecast Service', () => {
  it('should be able return the forecast for a list of beaches', async () => {
    const stormGlassService = new StormGlassService();
    
    jest.spyOn(stormGlassService, 'fetchPoints').mockResolvedValueOnce(stormGlassNormalizedResponse3Hours);
    
    const beach: Beach[] = [ 
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: BeachPosition.E,
        user: 'some-id'
      }
    ]

    const expectedResponse = [
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: 'E',
        rating: 1,
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        time: '2020-04-26T00:00:00+00:00',
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: 'E',
        rating: 1,
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        time: '2020-04-26T01:00:00+00:00',
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100
      },
      {
        lat: -33.792726,
        lng: 141.289824,
        name: 'Dee Why',
        position: 'E',
        rating: 1,
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        time: '2020-04-26T02:00:00+00:00',
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100
      }
    ]

    const forecast = new ForecastUseCase(stormGlassService);

    const beachesWithRating = await forecast.processForecastForBeaches(beach);

    expect(beachesWithRating).toEqual(expectedResponse)
  })
})