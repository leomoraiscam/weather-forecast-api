import { StormGlass } from './storm-glass';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";

import axios from "axios";

jest.mock('axios');

describe('Storm Glass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return the normalize forecast from the stormGlass service external API', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixture});

    const stormGlass = new StormGlass(mockedAxios);

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

    mockedAxios.get.mockResolvedValue({data: incompleteResponse});

    const stormGlass = new StormGlass(mockedAxios);

    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual([]);
  })

  it('should be able to get a generic error from stormGlass service when the request fail before reaching the service', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue({message: 'Network Error'});


    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error when trying to communicate to StormGlass: Network Error'
    );
  });

  it('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockRejectedValue({
      response: {
        status: 429,
        data: {
          errors: ['Rate Limit reached']
        }
      }
    });

    const stormGlass = new StormGlass(mockedAxios);

    await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
      'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});
