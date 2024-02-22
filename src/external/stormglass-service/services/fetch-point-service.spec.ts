import { InMemoryCacheService } from '@src/external/cache-service/in-memory/in-memory-cache-service';
import { AxiosRequestService } from '@src/external/http-service/services/axios-request-service';
import { InMemoryLoggerService } from '@src/external/logger-service/in-memory/in-memory-logger-service';
import fetchPointsNormalizedResponse from '@test/fixtures/fetch-points-normalized-response.json';
import stormGlassIncompleteResponse from '@test/fixtures/storm-glass-incomplete-response.json';
import stormGlassResponseGenericError from '@test/fixtures/storm-glass-response-generic-error.json';
import stormGlassResponseRateLimitError from '@test/fixtures/storm-glass-response-rate-limit-error.json';
import stormGlassWeather3HoursResponse from '@test/fixtures/storm-glass-response-weather-3-hours.json';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { FetchPointService } from './fetch-point-service';

jest.mock('@src/external/http-service/services/axios-request-service');

let inMemoryCacheService: InMemoryCacheService;
let inMemoryLoggerService: InMemoryLoggerService;

describe('StormGlass Service', () => {
  const mockedRequest = new AxiosRequestService() as jest.Mocked<AxiosRequestService>;

  let lat: number;
  let lng: number;

  beforeEach(() => {
    lat = -33.792726;
    lng = 151.289824;

    inMemoryCacheService = new InMemoryCacheService();
    inMemoryLoggerService = new InMemoryLoggerService();
  });

  it('should be able to return the normalize forecast data from the stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursResponse, status: 200 });

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng });

    expect(response).toEqual({
      value: fetchPointsNormalizedResponse,
    });
  });

  it('should be able to exclude incomplete data points received from stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassIncompleteResponse, status: 200 });

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng });

    expect(response).toEqual({
      value: [],
    });
  });

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseGenericError);

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseRateLimitError);

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to get the normalized forecast points from cache and use it to return data points', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursResponse, status: 200 });

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const input: IFetchPointCoordinate = {
      lat: -33.792726,
      lng: 151.289824,
      userId: 'user123',
    };

    const cachedDataMock = [
      {
        time: '2020-04-26T00:00:00+00:00',
        swellDirection: 64.26,
        swellHeight: 0.15,
        swellPeriod: 3.89,
        waveDirection: 231.38,
        waveHeight: 0.47,
        windDirection: 299.45,
        windSpeed: 100,
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        swellDirection: 123.41,
        swellHeight: 0.21,
        swellPeriod: 3.67,
        waveDirection: 232.12,
        waveHeight: 0.46,
        windDirection: 310.48,
        windSpeed: 100,
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        swellDirection: 182.56,
        swellHeight: 0.28,
        swellPeriod: 3.44,
        waveDirection: 232.86,
        waveHeight: 0.46,
        windDirection: 321.5,
        windSpeed: 100,
      },
    ];

    await inMemoryCacheService.save(
      `provider-forecast-point: ${input.userId}:${lat}-${lng}`,
      cachedDataMock,
    );

    const response = await fetchPointService.execute({
      lat: input.lat,
      lng: input.lng,
      userId: input.userId,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(cachedDataMock);
  });
});
