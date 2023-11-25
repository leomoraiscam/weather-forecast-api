import { BeachPosition } from '@config/constants/beach-position-enum';
import { createBeach } from '@test/factories/beach-factory';

import { IBeach } from '../../dtos/beach';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { RegisterBeachUseCase } from './register-beach-use-case';

let beachRepository: IBeachRepository;
let registerBeachUseCase: RegisterBeachUseCase;
let beach: IBeach;

describe('Create Beach Use Case', () => {
  beforeEach(() => {
    beachRepository = new InMemoryBeachRepository();
    registerBeachUseCase = new RegisterBeachUseCase(beachRepository);

    beach = {
      name: 'Dee why',
      lat: -33.792726,
      lng: 141.289824,
      position: BeachPosition.E,
      userId: 'fake-user-id',
    };
  });

  it('should be able to register new beach', async () => {
    const response = await registerBeachUseCase.execute(beach);

    expect(response.isRight()).toBeTruthy();
  });

  it('should not be able to register new beach with invalid data', async () => {
    const response = await registerBeachUseCase.execute({
      name: 'Dee why',
      lat: 151.289824,
      lng: 151.289824,
      position: BeachPosition.E,
      userId: 'fake-user-id',
    });

    expect(response.isLeft()).toBeTruthy();
  });

  it('should not be able to register new beach with existing lat and lng to the same user', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute(beach);

    expect(response.isLeft()).toBeTruthy();
  });

  it('should be able to register new beach with existing lat and lng to distinct user', async () => {
    const beachOrError = createBeach();

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute({
      name: 'Dee why',
      lat: -33.792726,
      lng: 151.289824,
      position: BeachPosition.E,
      userId: 'fake-id',
    });

    expect(response.isRight()).toBeTruthy();
  });
});
