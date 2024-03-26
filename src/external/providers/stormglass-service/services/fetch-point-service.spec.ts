import { InMemoryCacheService } from '@src/external/providers/cache-service/in-memory/in-memory-cache-service';
import { AxiosRequestService } from '@src/external/providers/http-service/services/axios-request-service';
import { InMemoryLoggerService } from '@src/external/providers/logger-service/in-memory/in-memory-logger-service';
import fetchPointsNormalizedResponse from '@test/fixtures/data/fetch-points-normalized-response.json';
import stormGlassIncompleteResponse from '@test/fixtures/data/storm-glass-incomplete-response.json';
import stormGlassResponseGenericError from '@test/fixtures/data/storm-glass-response-generic-error.json';
import stormGlassResponseRateLimitError from '@test/fixtures/data/storm-glass-response-rate-limit-error.json';
import stormGlassWeather3HoursResponse from '@test/fixtures/data/storm-glass-response-weather-3-hours.json';

import { IFetchPointCoordinate } from '../dtos/fetch-point-coordinate';
import { IFetchPointNormalize } from '../dtos/fetch-point-normalize';
import { FetchPointService } from './fetch-point-service';

jest.mock('@src/external/providers/http-service/services/axios-request-service');

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

    const response = (
      await fetchPointService.execute({
        lat,
        lng,
        page: 1,
        pageSize: 5,
      })
    ).value as IFetchPointNormalize[];

    expect(response).toEqual(fetchPointsNormalizedResponse);
    expect(response.length).toBe(5);
  });

  it('should be able to exclude incomplete data points received from stormGlass service', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassIncompleteResponse, status: 200 });

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng, page: 1, pageSize: 5 });

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

    const response = await fetchPointService.execute({ lat, lng, page: 1, pageSize: 5 });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseRateLimitError);

    const fetchPointService = new FetchPointService(
      mockedRequest,
      inMemoryCacheService,
      inMemoryLoggerService,
    );

    const response = await fetchPointService.execute({ lat, lng, page: 1, pageSize: 5 });

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
      page: 1,
      pageSize: 5,
    };

    const cachedDataMock = fetchPointsNormalizedResponse;

    await inMemoryCacheService.save(
      `provider-forecast-point: ${input.userId}:${lat}-${lng}`,
      cachedDataMock,
    );

    const response = await fetchPointService.execute({
      lat: input.lat,
      lng: input.lng,
      userId: input.userId,
      page: input.page,
      pageSize: input.pageSize,
    });

    expect(response.isRight()).toBeTruthy();
    expect(response.value).toEqual(cachedDataMock);
  });
});
