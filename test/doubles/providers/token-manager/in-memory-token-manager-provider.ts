import { JWTPayload } from '@src/application/contracts/providers/token-manager/dtos/token-data';
import { ITokenManagerProvider } from '@src/application/contracts/providers/token-manager/token-manager-provider';

export class InMemoryTokenManagerProvider implements ITokenManagerProvider {
  async sign(payload: JWTPayload): Promise<string> {
    return `${payload.id}token`;
  }
}
