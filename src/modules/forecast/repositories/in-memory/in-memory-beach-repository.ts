import { Beach } from "../../domain/beach/beach";
import { BeachCoordinate } from "../../dtos/beach-cordinate";
import { BeachMapper } from "../../mapper/beach-mapper";
import { IBeachRepository } from "../beaches-repository";

export class InMemoryBeachRepository implements IBeachRepository {
  beaches: Beach[] = [];

  async findByGeolocation(data: BeachCoordinate): Promise<Beach> {
    const { lat, lng } = data;
    
    return this.beaches.find((beach) => beach.lat.value === lat && beach.lng.value === lng)
  }

  async findAllBeachesByUser(userId: string): Promise<Beach[]> {
    const data =  [
      {
        id: "474a4d37-2503-470a-b55e-94b1abc66509",
        lat: -33.792726,
        lng: 151.289824,
        position: "N",
        userId: "7a5043d6-30b9-4340-bf6e-e89776968e72",
        name: "Dee Why"
      }
    ]

    return BeachMapper.toDomain(data)
  }

  async create(beach: Beach): Promise<Beach> {
    this.beaches.push(beach);

    return beach
  }
}