export interface IRateLimiter {
  consume(key: string): Promise<void>;
}
