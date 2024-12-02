import { IGetBeachForecastInput } from '@src/application/usecases/beaches/get-user-beaches-forecast/dtos/get-beach-forecast-input';
import { GetUserBeachesForecastUseCase } from '@src/application/usecases/beaches/get-user-beaches-forecast/get-user-beaches-forecast-use-case';
import { InMemoryLoggerService } from '@src/external/providers/logger-service/in-memory/in-memory-logger-service';
import { GetUserBeachesForecastController } from '@src/presentation/controllers/get-user-beaches-forecast-controller';
import { IHttpRequest } from '@src/shared/http/dtos/http-request';
import { InMemoryBeachRepository } from '@test/doubles/repositories/in-memory-beach-repository';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';
import { StormGlassServiceMock } from '@test/fixtures/mocks/storm-glass-service-mock';

describe('GetUserBeachesForecastWebController', () => {
  let inMemoryBeachRepository: InMemoryBeachRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLoggerService: InMemoryLoggerService;
  let stormGlassServiceMock: StormGlassServiceMock;
  let getUserBeachesForecastController: GetUserBeachesForecastController;
  let getUserBeachesForecastUseCase: GetUserBeachesForecastUseCase;
  let userId: string;

  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLoggerService = new InMemoryLoggerService();
    stormGlassServiceMock = new StormGlassServiceMock();
    getUserBeachesForecastUseCase = new GetUserBeachesForecastUseCase(
      stormGlassServiceMock,
      inMemoryUserRepository,
      inMemoryBeachRepository,
      inMemoryLoggerService,
    );
    getUserBeachesForecastController = new GetUserBeachesForecastController(
      getUserBeachesForecastUseCase,
    );

    const user = createUser();
    await inMemoryUserRepository.create(user);

    userId = user.id;

    const beach = createBeach({
      userId,
    });

    await inMemoryBeachRepository.create(beach);
  });

  it('should be able to return status code 200 when request contains valid user data', async () => {
    const request: IHttpRequest<IGetBeachForecastInput> = {
      userId,
      query: {
        page: 1,
        pageSize: 5,
      },
    };
    const response = await getUserBeachesForecastController.handle(request);

    expect(response.statusCode).toEqual(200);
  });

  it('should be able to return status code 404 when user does not exist', async () => {
    const request: IHttpRequest<IGetBeachForecastInput> = {
      userId: 'id-non-exist',
      query: {
        page: 1,
        pageSize: 5,
      },
    };
    const response = await getUserBeachesForecastController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should be able to return status code 404 when user does not exist', async () => {
    const user = createUser({
      id: 'other-id',
    });
    await inMemoryUserRepository.create(user);

    const request: IHttpRequest<IGetBeachForecastInput> = {
      userId: user.id,
      query: {
        page: 1,
        pageSize: 5,
      },
    };
    const response = await getUserBeachesForecastController.handle(request);

    expect(response.statusCode).toEqual(404);
  });

  it('should be able to return status code 500 when server raises', async () => {
    jest
      .spyOn(getUserBeachesForecastUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Unexpected server error'));

    const request: IHttpRequest<IGetBeachForecastInput> = {
      userId,
      query: {
        page: 1,
        pageSize: 5,
      },
    };
    const controller = new GetUserBeachesForecastController(getUserBeachesForecastUseCase);
    const response = await controller.handle(request);

    expect(response.statusCode).toEqual(500);
  });
});
