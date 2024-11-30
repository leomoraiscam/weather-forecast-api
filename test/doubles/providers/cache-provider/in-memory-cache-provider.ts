import { ICacheProvider, ICacheData } from '@src/application/interfaces/providers/cache-provider';

export class InMemoryCacheProvider implements ICacheProvider {
  private cache: ICacheData = {};

  public async save<T>(key: string, value: T): Promise<void> {
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

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter((key) => key.startsWith(`${prefix}:`));

    keys.forEach((key) => {
      delete this.cache[key];
    });
  }
}
