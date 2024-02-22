import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryUserRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-user-repository';
import { InvalidLatitudeError } from '@src/modules/forecast/domain/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '@src/modules/forecast/domain/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '@src/modules/forecast/domain/beach/errors/invalid-name-error';
import { InvalidPositionError } from '@src/modules/forecast/domain/beach/errors/invalid-position-error';
import { IRegisterBeachDTO } from '@src/modules/forecast/dtos/register-beach';
import { InMemoryBeachRepository } from '@src/modules/forecast/repositories/in-memory/in-memory-beach-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';

import { RegisterBeachUseCase } from './register-beach-use-case';

let inMemoryBeachRepository: InMemoryBeachRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let registerBeachUseCase: RegisterBeachUseCase;
let beach: IRegisterBeachDTO;
let userId: string;

describe('Register Beach Use Case', () => {
  beforeEach(async () => {
    inMemoryBeachRepository = new InMemoryBeachRepository();
    inMemoryUserRepository = new InMemoryUserRepository();
    registerBeachUseCase = new RegisterBeachUseCase(
      inMemoryBeachRepository,
      inMemoryUserRepository,
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

  it('should be able to register new beach', async () => {
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
      lng: -33.7509199,
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
