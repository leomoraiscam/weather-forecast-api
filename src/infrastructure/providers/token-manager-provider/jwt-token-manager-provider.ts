import { sign, verify } from 'jsonwebtoken';

import { JWTPayload } from '@src/application/contracts/providers/token-manager-provider/dtos/token-data';
import { ITokenManagerProvider } from '@src/application/contracts/providers/token-manager-provider/token-manager-provider';

export class JWTTokenManagerProvider implements ITokenManagerProvider {
  async sign(payload: JWTPayload, expiresIn?: string): Promise<string> {
    return sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN,
    });
  }

  async verify(token: string): Promise<JWTPayload> {
    return verify(token, process.env.JWT_SECRET_TOKEN) as JWTPayload;
  }
}
