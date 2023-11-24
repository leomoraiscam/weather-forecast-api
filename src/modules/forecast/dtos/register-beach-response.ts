import { IBeach } from './beach';

export interface IRegisterBeachResponse extends Omit<IBeach, 'position'> {
  id: string;
  position: string;
}
