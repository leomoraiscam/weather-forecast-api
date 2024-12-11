import { IStormGlassIntegrationsService } from '@src/application/contracts/services/stormglass/stormglass-integration-interface';
import { StormGlassIntegrationService } from '@src/application/services/stormglass/stormglass-integration-service';
import { StormGlassResponseError } from '@src/application/usecases/beaches/errors/stormglass-response-error';
import { AxiosProvider } from '@src/infrastructure/providers/http-provider/axios-provider';
import { InMemoryLoggerProvider } from '@test/doubles/providers/logger-provider/in-memory-logger-service';
import stormGlassResponseGenericError from '@test/fixtures/data/storm-glass-response-generic-error.json';
import stormGlassResponseRateLimitError from '@test/fixtures/data/storm-glass-response-rate-limit-error.json';
import stormGlassWeather3HoursResponse from '@test/fixtures/data/storm-glass-response-weather-3-hours.json';

jest.mock('@src/infrastructure/providers/http-provider/axios-provider');

describe('StormGlassIntegrationService', () => {
  let lat: number;
  let lng: number;
  const mockedRequest = new AxiosProvider(
    new InMemoryLoggerProvider(),
  ) as jest.Mocked<AxiosProvider>;
  let stormGlassIntegrationService: IStormGlassIntegrationsService;

  beforeEach(() => {
    lat = -33.792726;
    lng = 151.289824;

    stormGlassIntegrationService = new StormGlassIntegrationService(mockedRequest);
  });

  it('should be able to return the forecast data from the stormGlassService when received correct data', async () => {
    mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursResponse, status: 200 });

    const response = await stormGlassIntegrationService.execute({ lat, lng });

    expect(response).toEqual(stormGlassWeather3HoursResponse);
    expect(response.hours).toHaveLength(5);
  });

  it('should be able to return an error when the request fail before reaching the service', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseGenericError);

    await expect(stormGlassIntegrationService.execute({ lat, lng })).rejects.toBeInstanceOf(
      StormGlassResponseError,
    );
  });

  it('should be able to return an error when service responds with error', async () => {
    mockedRequest.get.mockRejectedValue(stormGlassResponseRateLimitError);

    await expect(stormGlassIntegrationService.execute({ lat, lng })).rejects.toBeInstanceOf(
      StormGlassResponseError,
    );
  });
});
