import { RegisterBeachInput } from './register-beach-input';

export interface RegisterBeachOutput extends Omit<RegisterBeachInput, 'position'> {
  id: string;
  position: string;
}
