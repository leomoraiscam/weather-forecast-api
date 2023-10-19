import { FetchPointService } from "@src/external/stormglass-service/fetch-point-service"
import stormGlassNormalizedResponse3Hours  from "@test/fixtures/storm-glass-normalized-response-3-hours.json";
import processForecastBeachesResponse  from "@test/fixtures/process-forecast-beaches-response.json";
import { ProcessForecastBeachesUseCase } from "./process-forecast-for-beaches-use-case";
import { Beach as IBeach} from "../../dtos/beach-forecast";
import { BeachPosition } from "@config/constants/beach-position-enum"
import { ForecastProcessingInternalError } from "../errors/forecast-processing-error"
import { Beach } from "@src/modules/forecast/domain/beach/beach"
import { Name } from "@src/modules/forecast/domain/beach/name"
import { Longitude } from "@src/modules/forecast/domain/beach/longitude"
import { Latitude } from "@src/modules/forecast/domain/beach/latitude"
import { Position } from "@src/modules/forecast/domain/beach/position"
import { AxiosRequestProvider } from "@src/external/stormglass-service/providers/implementations/axios-request-provider";

jest.mock("@src/external/stormglass-service/fetch-point-service")

describe('Forecast Service', () => {
  let beach;
  let serializedBeach: IBeach[];

  const mockedRequest = new AxiosRequestProvider() as jest.Mocked<AxiosRequestProvider>;
  const mockedStormGlassService = new FetchPointService(mockedRequest) as jest.Mocked<FetchPointService>;

  beforeEach(() => {
    const name = Name.create('Dee Why') as Name;
    const lat = Latitude.create( -33.792726) as Latitude;
    const lng = Longitude.create(151.289824) as Longitude;
    const position = Position.create(BeachPosition.E) as Position;
    
    beach = Beach.create({
      name,
      lat,
      lng,
      position,
    });

    beach = beach.props;

    serializedBeach = [
      {
        lat: beach.lat.value,
        lng: beach.lng.value,
        name: beach.name.value,
        position: beach.position.value as BeachPosition,
      }
    ];
  })

  it('should be able return the forecast for a list of beaches', async () => {
    mockedStormGlassService.execute.mockResolvedValueOnce(stormGlassNormalizedResponse3Hours);

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(mockedStormGlassService);

    const beachesWithRating = await processForecastBeachesUseCase.execute(serializedBeach);

    expect(beachesWithRating).toEqual(processForecastBeachesResponse)
  })

  it('should be able to return an empty list the beaches array is empty', async() => {
    mockedStormGlassService.execute.mockResolvedValueOnce([]);
    
    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(mockedStormGlassService);

    const response = await processForecastBeachesUseCase.execute([]);

    expect(response).toEqual([]);
  })

  it.skip('should be able to throw internal processing error when something goes wrong during the rating process', async () => {
    mockedStormGlassService.execute.mockRejectedValueOnce('Error fetching data');

    const processForecastBeachesUseCase = new ProcessForecastBeachesUseCase(mockedStormGlassService);

    await expect(
      processForecastBeachesUseCase.execute(serializedBeach)
    ).rejects.toThrow(ForecastProcessingInternalError)
  })
})