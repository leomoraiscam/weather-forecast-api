import { Beach } from "../../domain/beach/beach";
import { BeachCoordinate } from "../../dtos/beach-cordinate";
import { IBeachRepository } from "../beaches-repository";

export class InMemoryBeachRepository implements IBeachRepository {
  beaches: Beach[] = [];

  async findByGeolocation(data: BeachCoordinate): Promise<Beach> {
    const { lat, lng } = data;
    
    return this.beaches.find((beach) => beach.lat.value === lat && beach.lng.value === lng)
  }

  async create(beach: Beach): Promise<Beach> {
    this.beaches.push(beach);

    return beach
  }
}