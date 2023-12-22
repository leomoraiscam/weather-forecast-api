export interface ICacheService {
  save(key: string, value: any): Promise<void>;
  recover<T>(key: string): Promise<T | null>;
}
