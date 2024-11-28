import {
  ITokenManagerProvider,
  JWT,
} from '@src/application/interfaces/providers/token-manager-provider';

export class InMemoryTokenManagerProvider implements ITokenManagerProvider {
  async sign(payload: JWT): Promise<string> {
    return `${payload.id}token`;
  }
}
