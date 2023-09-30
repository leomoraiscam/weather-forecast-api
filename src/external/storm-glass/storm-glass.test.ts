import { StormGlass } from './storm-glass';

describe('Storm Glass Client', () => {
  it('should return the normalize forecast from the stormGlass service external API', async () => {
    const lat = -33.792726;
    const long = 151.289824;

    const stormGlass = new StormGlass();

    // TODO: Rename fetchPoints to execute, because this method is main method
    const response = await stormGlass.fetchPoints(lat, long);

    expect(response).toEqual({});
  });
});
