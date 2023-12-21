import { InMemoryCacheProvider } from '@src/external/cache-service/in-memory/in-memory-cache-provider';
import { AxiosRequestProvider } from '@src/external/http-service/services/axios-request-provider';
import fetchPointsNormalizedResponse from '@test/fixtures/fetch-points-normalized-response.json';
import stormGlassIncompleteResponse from '@test/fixtures/storm-glass-incomplete-response.json';
import stormGlassResponseGenericError from '@test/fixtures/storm-glass-response-generic-error.json';
import stormGlassResponseRateLimitError from '@test/fixtures/storm-glass-response-rate-limit-error.json';
import stormGlassWeather3HoursResponse from '@test/fixtures/storm-glass-response-weather-3-hours.json';

import { FetchPointService } from './fetch-point-service';

jest.mock('@src/external/stormglass-service/providers/implementations/axios-request-provider');

let inMemoryCacheProvider: InMemoryCacheProvider;

describe('StormGlass Service', () => {
  const mockedRequest = new AxiosRequestProvider() as jest.Mocked<AxiosRequestProvider>;

  let lat: number;
  let lng: number;

  beforeEach(() => {
    const inputGeolocation = {
      lat: -33.792726,
      lng: 151.289824,
    };

    lat = inputGeolocation.lat;
    lng = inputGeolocation.lng;

    inMemoryCacheProvider = new InMemoryCacheProvider();
  });

  it('should be able to return the normalize forecast data from the stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursResponse, status: 200 });

    const fetchPointService = new FetchPointService(mockedRequest, inMemoryCacheProvider);

    const response = await fetchPointService.execute({ lat, lng });

    expect(response).toEqual({
      value: fetchPointsNormalizedResponse,
    });
  });

  it('should be able to exclude incomplete data points received from stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassIncompleteResponse, status: 200 });

    const fetchPointService = new FetchPointService(mockedRequest, inMemoryCacheProvider);

    const response = await fetchPointService.execute({ lat, lng });

    expect(response).toEqual({
      value: [],
    });
  });

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseGenericError);

    const fetchPointService = new FetchPointService(mockedRequest, inMemoryCacheProvider);

    const response = await fetchPointService.execute({ lat, lng });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseRateLimitError);

    const fetchPointService = new FetchPointService(mockedRequest, inMemoryCacheProvider);

    const response = await fetchPointService.execute({ lat, lng });

    expect(response.isLeft()).toBeTruthy();
  });
});
