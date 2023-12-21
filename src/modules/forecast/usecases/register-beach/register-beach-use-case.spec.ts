import { BeachPosition } from '@config/constants/beach-position-enum';
import { InMemoryUsersRepository } from '@src/modules/accounts/repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '@src/modules/accounts/repositories/users-repository';
import { createBeach } from '@test/factories/beach-factory';
import { createUser } from '@test/factories/user-factory';

import { InvalidLatitudeError } from '../../domain/beach/errors/invalid-latitude-error';
import { InvalidLongitudeError } from '../../domain/beach/errors/invalid-longitude-error';
import { InvalidNameError } from '../../domain/beach/errors/invalid-name-error';
import { InvalidPositionError } from '../../domain/beach/errors/invalid-position-error';
import { IBeach } from '../../dtos/beach';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { RegisterBeachUseCase } from './register-beach-use-case';

let beachRepository: IBeachRepository;
let usersRepository: IUsersRepository;

let registerBeachUseCase: RegisterBeachUseCase;
let beach: IBeach;
let userId: string;

describe('Create Beach Use Case', () => {
  beforeEach(async () => {
    beachRepository = new InMemoryBeachRepository();
    usersRepository = new InMemoryUsersRepository();
    registerBeachUseCase = new RegisterBeachUseCase(beachRepository, usersRepository);

    const user = createUser();

    userId = user.id;

    await usersRepository.create(user);

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
      name: 'Dee why',
      lat: 151.289824,
      lng: 151.289824,
      position: BeachPosition.E,
      userId,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidLatitudeError);
  });

  it('should not be able to register new beach with lng in invalid', async () => {
    const response = await registerBeachUseCase.execute({
      name: 'Dee why',
      lat: -33.750919,
      lng: -33.7509199,
      position: BeachPosition.E,
      userId,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidLongitudeError);
  });

  it('should not be able to register new beach with name in invalid', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute({
      name: 'D',
      lat: -33.750919,
      lng: 151.299059,
      position: BeachPosition.S,
      userId,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidNameError);
  });

  it('should not be able to register new beach with position in invalid', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute({
      name: 'Dee Why',
      lat: -33.750919,
      lng: 151.299059,
      userId,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidPositionError);
  });

  it('should not be able to register new beach with existing lat and lng to the same user', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute(beach);

    expect(response.isLeft()).toBeTruthy();
  });

  it.skip('should be able to register new beach with existing lat and lng to distinct user', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute({
      name: 'Dee Why',
      lat: -33.750919,
      lng: 151.299059,
      position: BeachPosition.S,
      userId,
    });

    expect(response.isRight()).toBeTruthy();
  });
});
