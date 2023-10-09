import { FetchPointService } from "@src/external/stormglass-service/fetch-point-service"
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import { ForecastUseCase } from "./process-forecast-for-beaches-use-case";
import { Beach } from "../../dtos/beach-forecast";
import { BeachPosition } from "@config/constants/beach-position-enum"
import { ForecastProcessingInternalError } from "../errors/forecast-processing-error"

jest.mock("@src/external/stormglass-service/fetch-point-service")

describe('Forecast Service', () => {
  const mockedStormGlassService = new FetchPointService() as jest.Mocked<FetchPointService>;

  it('should be able return the forecast for a list of beaches', async () => {
    mockedStormGlassService.execute.mockResolvedValueOnce(stormGlassNormalizedResponse3Hours);
    
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
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: "2020-04-26T00:00:00+00:00",
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100
          } 
        ],
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'E',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: "2020-04-26T01:00:00+00:00",
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 141.289824,
            name: 'Dee Why',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: "2020-04-26T02:00:00+00:00",
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ]

    const forecast = new ForecastUseCase(mockedStormGlassService);

    const beachesWithRating = await forecast.processForecastForBeaches(beach);

    expect(beachesWithRating).toEqual(expectedResponse)
  })

  it('should be able to return an empty list the beaches array is empty', async() => {
    const forecast = new ForecastUseCase();

    const response = await forecast.processForecastForBeaches([]);

    expect(response).toEqual([]);
  })

  it('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    const beaches: Beach[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: BeachPosition.E,
        user: 'fake-id',
      }
    ];

    mockedStormGlassService.execute.mockRejectedValue('Error fetching data');

    const forecast = new ForecastUseCase(mockedStormGlassService);

    await expect(
      forecast.processForecastForBeaches(beaches)
    ).rejects.toThrow(ForecastProcessingInternalError)
  })
})