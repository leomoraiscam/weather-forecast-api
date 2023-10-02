import { StormGlass } from './storm-glass';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";

import axios from "axios";

jest.mock('axios');

describe('Storm Glass Client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('should return the normalize forecast from the stormGlass service external API', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    mockedAxios.get.mockResolvedValue({data: stormGlassWeather3HoursFixture});

    const stormGlass = new StormGlass(mockedAxios);

    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual(stormGlassNormalizedResponse3Hours);
  });
});
