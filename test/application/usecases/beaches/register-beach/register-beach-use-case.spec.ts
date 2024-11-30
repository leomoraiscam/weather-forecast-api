import { BeachPosition } from '@config/constants/beach-position-enum';
import { RegisterBeachInput } from '@src/application/usecases/beaches/register-beach/dtos/register-beach-input';
import { RegisterBeachUseCase } from '@src/application/usecases/beaches/register-beach/register-beach-use-case';
import { InvalidLatitudeError } from '@src/entities/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '@src/entities/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '@src/entities/beach/errors/invalid-name-error';
import { InvalidPositionError } from '@src/entities/beach/errors/invalid-position-error';
import { InMemoryCacheProvider } from '@test/doubles/providers/cache-provider/in-memory-cache-provider';
import { InMemoryBeachRepository } from '@test/doubles/repositories/in-memory-beach-repository';
import { InMemoryUserRepository } from '@test/doubles/repositories/in-memory-user-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';

describe('RegisterBeachUseCase', () => {
  let inMemoryBeachRepository: InMemoryBeachRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryCacheProvider: InMemoryCacheProvider;
  let registerBeachUseCase: RegisterBeachUseCase;
  let beach: RegisterBeachInput;
  let userId: string;

  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryCacheProvider = new InMemoryCacheProvider();
    registerBeachUseCase = new RegisterBeachUseCase(
      inMemoryBeachRepository,
      inMemoryUserRepository,
      inMemoryCacheProvider,
    );

    const user = createUser();
    userId = user.id;

    await inMemoryUserRepository.create(user);

    beach = {
      name: 'Dee Why',
      lat: -33.750919,
      lng: 151.299059,
      position: BeachPosition.S,
      userId: 'fake-user-id',
    };
  });

  it('should be able to register new beach when received correct data', async () => {
    const response = await registerBeachUseCase.execute(beach);

    expect(response.isRight()).toBeTruthy();
  });

  it('should not be able to register new beach with lat in invalid', async () => {
    const response = await registerBeachUseCase.execute({
      ...beach,
      lat: 151.289824,
      lng: 151.289824,
      position: BeachPosition.E,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidLatitudeError);
  });

  it('should not be able to register new beach with lng in invalid', async () => {
    const response = await registerBeachUseCase.execute({
      ...beach,
      lat: -33.750919,
      lng: 200,
      position: BeachPosition.E,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidLongitudeError);
  });

  it('should not be able to register new beach with name in invalid', async () => {
    const response = await registerBeachUseCase.execute({
      ...beach,
      name: 'D',
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should not be able to register new beach with position in invalid', async () => {
    const response = await registerBeachUseCase.execute({
      ...beach,
      position: undefined,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidPositionError);
  });

  it('should not be able to register new beach with existing lat and lng to the same user', async () => {
    const beachOrError = createBeach();
    inMemoryBeachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute(beach);

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to register new beach with existing lat and lng to distinct user', async () => {
    const response = await registerBeachUseCase.execute({
      ...beach,
      userId,
    });

    expect(response.isRight()).toBeTruthy();
  });
});
