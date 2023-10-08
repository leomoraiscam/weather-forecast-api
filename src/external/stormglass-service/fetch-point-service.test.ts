import { FetchPointService } from './fetch-point-service';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import * as HTTPUtil from "@src/utils/request"

jest.mock('@src/utils/request');

describe('Fetch Point Client Service', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should be able to return the normalize forecast data from the stormGlass service', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedRequest.get.mockResolvedValue({data: stormGlassWeather3HoursFixture} as HTTPUtil.Response);

    const fetchPointService = new FetchPointService(mockedRequest);

    const response = await fetchPointService.execute({lat, long});

    expect(response).toEqual(stormGlassNormalizedResponse3Hours);
  });

  it('should be able to exclude incomplete data points received from stormGlass service', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300
          },
          time: "2020-04-26T02:00:00+00:00"
        }
      ]
    }

    mockedRequest.get.mockResolvedValue({data: incompleteResponse} as HTTPUtil.Response);

    const fetchPointService = new FetchPointService(mockedRequest);

    const response = await fetchPointService.execute({lat, long});

    expect(response).toEqual([]);
  })

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedRequest.get.mockRejectedValue({message: 'Network Error'});

    const fetchPointService = new FetchPointService(mockedRequest);

    await expect(fetchPointService.execute({lat, long})).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should be able to get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached']
        }
      }
    });

    const fetchPointService = new FetchPointService(mockedRequest);

    await expect(fetchPointService.execute({lat, long})).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
