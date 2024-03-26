export interface ICacheService {
  save<T>(key: string, value: T): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
}
