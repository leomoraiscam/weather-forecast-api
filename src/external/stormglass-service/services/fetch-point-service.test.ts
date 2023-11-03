import { FetchPointService } from './fetch-point-service';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import stormGlassIncompleteResponse from "@test/fixtures/storm-glass-incomplete-response.json";
import stormGlassResponseError from "@test/fixtures/storm-glass-response-error.json";
import { HttpResponse } from "../providers/dtos/http-response"
import { AxiosRequestProvider } from "@src/external/stormglass-service/providers/implementations/axios-request-provider"

jest.mock('@src/external/stormglass-service/providers/implementations/axios-request-provider');

describe('Fetch Point Client Service', () => {
  const mockedRequest = new AxiosRequestProvider() as jest.Mocked<AxiosRequestProvider>;

  it('should be able to return the normalize forecast data from the stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HttpResponse<{
      hours: [
        {
          swellDirection: {
            noaa: number
          },
          swellHeight: {
            noaa: number
          },
          swellPeriod: {
            noaa: number
          },
          time: Date,
          waveDirection: {
            noaa: number
          },
          waveHeight: {
            noaa: number
          },
          windDirection: {
            noaa: number
          },
          windSpeed: {
            noaa: number
          }
        }
      ],
      meta: {
        cost: number,
        dailyQuota: number,
        end: Date,
        lat: number,
        lng: number,
        params: string[],
        requestCount: number,
        source: string[],
        start: Date
      }
    }>);

    const { lat, long } = {
      lat: -33.792726,
      long: 151.289824
    }

    const fetchPointService = new FetchPointService(mockedRequest);

    const response = await fetchPointService.execute({ lat, long });

    expect(response).toEqual(stormGlassNormalizedResponse3Hours);
  });

  it('should be able to exclude incomplete data points received from stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({data: stormGlassIncompleteResponse} as HttpResponse<{}>);

    const { lat, long } = {
      lat: -33.792726,
      long: 151.289824
    }

    const fetchPointService = new FetchPointService(mockedRequest);

    const response = await fetchPointService.execute({lat, long});

    expect(response).toEqual([]);
  })

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const { lat, long } = {
      lat: -33.792726,
      long: 151.289824
    }

    const fetchPointService = new FetchPointService(mockedRequest);

    await expect(fetchPointService.execute({lat, long})).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should be able to get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseError);
   
    const { lat, long } = {
      lat: -33.792726,
      long: 151.289824
    }

    const fetchPointService = new FetchPointService(mockedRequest);

    await expect(fetchPointService.execute({lat, long})).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
