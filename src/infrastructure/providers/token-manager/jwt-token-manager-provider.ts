import { sign } from 'jsonwebtoken';

import {
  ITokenManagerProvider,
  JWT,
} from '@src/application/interfaces/providers/token-manager-provider';

export class JWTTokenManagerProvider implements ITokenManagerProvider {
  async sign(payload: JWT, expiresIn?: string): Promise<string> {
    return sign(payload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: expiresIn || process.env.JWT_EXPIRES_IN,
    });
  }
}
