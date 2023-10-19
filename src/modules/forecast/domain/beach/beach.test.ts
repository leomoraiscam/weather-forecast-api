import { BeachPosition } from '@config/constants/beach-position-enum'
import { Beach } from './beach'
import { Name } from "./name";
import { Position } from "./position";
import { Latitude } from "./latitude";
import { Longitude } from "./longitude";

describe('Domain Beach model', () => {
  it('should be able to create new beach', () => {
    const name = Name.create('Dee Why') as Name;
    const lat = Latitude.create( -33.792726) as Latitude;
    const lng = Longitude.create(151.289824) as Longitude;
    const position = Position.create(BeachPosition.S) as Position;
    
    const beach = Beach.create({
      name,
      lat,
      lng,
      position,
    })

    expect(beach).toHaveProperty('_id');
  })
})
