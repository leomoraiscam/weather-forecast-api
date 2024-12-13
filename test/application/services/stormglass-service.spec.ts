import { StormGlassIntegrationService } from '@src/application/services/stormglass/stormglass-integration-service';
import { StormGlassService } from '@src/application/services/stormglass/stormglass-service';
import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';
import { AxiosProvider } from '@src/infrastructure/providers/http-provider/axios-provider';
import { InMemoryCacheProvider } from '@test/doubles/providers/cache-provider/in-memory-cache-provider';
import { InMemoryLoggerProvider } from '@test/doubles/providers/logger-provider/in-memory-logger-service';
import fetchPointsNormalizedResponse from '@test/fixtures/data/fetch-points-normalized-response.json';
import stormGlassIncompleteResponse from '@test/fixtures/data/storm-glass-incomplete-response.json';
import stormGlassResponseGenericError from '@test/fixtures/data/storm-glass-response-generic-error.json';
import stormGlassWeather3HoursResponse from '@test/fixtures/data/storm-glass-response-weather-3-hours.json';
import stormGlassWeatherWithWrongPropertiesValuesResponse from '@test/fixtures/data/storm-glass-with-wrong-properties-value-response.json';

jest.mock('@src/infrastructure/providers/http-provider/axios-provider');

describe('StormGlass Service', () => {
  let lat: number;
  let lng: number;
  let inMemoryCacheProvider: InMemoryCacheProvider;
  const mockedRequest = new AxiosProvider(
    new InMemoryLoggerProvider(),
  ) as jest.Mocked<AxiosProvider>;

  beforeEach(() => {
    inMemoryCacheProvider = new InMemoryCacheProvider();
  });

  it('should be able to return the normalize forecast when receive correct parameters', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursResponse, status: 200 });

    const stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
    const fetchPointService = new StormGlassService(
      inMemoryCacheProvider,
      stormGlassIntegrationService,
    );
    const response = await fetchPointService.execute({
      lat,
      lng,
      page: 1,
      pageSize: 10,
      userId: 'fake',
    });

    expect(response).toEqual(fetchPointsNormalizedResponse);
  });

  it('should be able to exclude incomplete data points when received incorrect response from storm glass integration', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassIncompleteResponse, status: 200 });

    const stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
    const fetchPointService = new StormGlassService(
      inMemoryCacheProvider,
      stormGlassIntegrationService,
    );

    const response = await fetchPointService.execute({
      lat,
      lng,
      page: 1,
      pageSize: 10,
      userId: 'fake',
    });
    expect(response).toEqual([]);
  });

  it('should be able to return an error when the storm glass integration fails', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseGenericError);

    const stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
    const fetchPointService = new StormGlassService(
      inMemoryCacheProvider,
      stormGlassIntegrationService,
    );

    await expect(
      fetchPointService.execute({ lat, lng, page: 1, pageSize: 10, userId: 'fake' }),
    ).rejects.toBeInstanceOf(StormGlassResponseError);
  });

  it('should be able to return normalized forecast points when data has cached', async () => {
    const cacheKey = `forecast-point:${lat}:${lng}:user123:1-5`;
    await inMemoryCacheProvider.save(cacheKey, fetchPointsNormalizedResponse);

    const stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
    const fetchPointService = new StormGlassService(
      inMemoryCacheProvider,
      stormGlassIntegrationService,
    );
    const response = await fetchPointService.execute({
      lat,
      lng,
      page: 1,
      pageSize: 5,
      userId: 'user123',
    });

    expect(response).toEqual(fetchPointsNormalizedResponse);
    expect(mockedRequest.get).not.toHaveBeenCalled();
  });

  it('should exclude data points with missing required properties', async () => {
    mockedRequest.get.mockResolvedValue({
      data: stormGlassWeatherWithWrongPropertiesValuesResponse,
      status: 200,
    });

    const stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
    const fetchPointService = new StormGlassService(
      inMemoryCacheProvider,
      stormGlassIntegrationService,
    );
    const response = await fetchPointService.execute({
      lat,
      lng,
      page: 1,
      pageSize: 10,
      userId: 'fake',
    });
    expect(response).toEqual([]);
  });
});
