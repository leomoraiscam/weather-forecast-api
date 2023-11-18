import { InMemoryBeachRepository } from '../../repositories/in-memory/in-memory-beach-repository';
import { IBeachRepository } from '../../repositories/beaches-repository';
import { RegisterBeachUseCase } from './register-beach-use-case'
import { BeachPosition } from '@config/constants/beach-position-enum';
import { Name } from '../../domain/beach/name';
import { Latitude } from '../../domain/beach/latitude';
import { Longitude } from '../../domain/beach/longitude';
import { Position } from '../../domain/beach/position';
import { Beach } from '../../domain/beach/beach';

let beachRepository: IBeachRepository
let registerBeachUseCase: RegisterBeachUseCase

describe('Create Beach Use Case', () => {
  beforeEach(() => {
    beachRepository = new InMemoryBeachRepository()
    registerBeachUseCase = new RegisterBeachUseCase(beachRepository)
  })

  it('should be able to register new beach', async () => {
    const response = await registerBeachUseCase.execute({
      name: 'John Doe',
      lat: 1,
      lng: 1,
      position: BeachPosition.E,
      userId: 'fake-user-id'
    })

    expect(response.isRight()).toBeTruthy()  
  })

  it('should not be able to register new beach with invalid data', async () => {
    const response = await registerBeachUseCase.execute({
      name: 'John Doe',
      lat: 151.289824,
      lng: 1,
      position: BeachPosition.E,
      userId: 'fake-user-id'
    })
   
    expect(response.isLeft()).toBeTruthy()
  })

  it('should not be able to register new beach with existing lat and lng', async () => {
    const name = Name.create('Dee Why').value as Name;
    const lat = Latitude.create(-33.792726).value as Latitude;
    const lng = Longitude.create(151.289824).value as Longitude;
    const position = Position.create(BeachPosition.S).value as Position;
    
    const beachOrError = Beach.create({
      name,
      lat,
      lng,
      position,
      userId: 'fake-user-id'
    }).value as Beach

    beachRepository.create(beachOrError);

    const response = await registerBeachUseCase.execute({
      name: 'John Doe',
      lat: -33.792726,
      lng: 151.289824,
      position: BeachPosition.S,
      userId: 'fake-user-id'
    })

    expect(response.isLeft()).toBeTruthy();
  })
})
