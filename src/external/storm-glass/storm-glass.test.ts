import { StormGlass } from './storm-glass';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import * as HTTPUtil from "@src/utils/request"

jest.mock('@src/utils/request');

describe('Storm Glass Client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return the normalize forecast from the stormGlass service external API', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedRequest.get.mockResolvedValue({data: stormGlassWeather3HoursFixture} as HTTPUtil.Response);

    const stormGlass = new StormGlass(mockedRequest);

    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual(stormGlassNormalizedResponse3Hours);
  });

  it('should exclude incomplete data points', async () => {
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

    const stormGlass = new StormGlass(mockedRequest);

    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual([]);
  })

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({message: 'Network Error'});


    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);
    
    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached']
        }
      }
    });

    const stormGlass = new StormGlass(mockedRequest);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
