import { ICacheData } from '../dtos/cache-data';
import { ICacheService } from '../ports/cache-service';

export class InMemoryCacheService implements ICacheService {
  private cache: ICacheData = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }
}
