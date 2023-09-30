import { StormGlass } from './storm-glass';
import stormGlassWeather3HoursFixture  from "@test/fixtures/storm-glass-weather-3-hours.json";
import axios from "axios";

jest.mock('axios');

const mockAxiosGet = jest.fn()

describe('Storm Glass Client', () => {
  it('should return the normalize forecast from the stormGlass service external API', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    axios.get = mockAxiosGet.mockResolvedValue(stormGlassWeather3HoursFixture);

    const stormGlass = new StormGlass(axios);

    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual(stormGlassWeather3HoursFixture);
  });
});
