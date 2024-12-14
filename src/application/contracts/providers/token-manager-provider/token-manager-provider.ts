import { JWTPayload } from './dtos/token-data';

export interface ITokenManagerProvider {
  sign(payload: JWTPayload, expiresIn?: string): Promise<string>;
  verify(token: string): Promise<JWTPayload>;
}
