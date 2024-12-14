export interface IRateLimiterProvider {
  consume(key: string): Promise<void>;
}
