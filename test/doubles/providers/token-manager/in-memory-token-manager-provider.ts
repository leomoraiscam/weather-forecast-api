import { JWTPayload } from '@src/application/contracts/providers/token-manager-provider/dtos/token-data';
import { ITokenManagerProvider } from '@src/application/contracts/providers/token-manager-provider/token-manager-provider';

export class InMemoryTokenManagerProvider implements ITokenManagerProvider {
  async sign(payload: JWTPayload): Promise<string> {
    return `${payload.id}token`;
  }

  async verify(token: string): Promise<JWTPayload> {
    return { id: token.substring(0, token.indexOf('token')) };
  }
}
