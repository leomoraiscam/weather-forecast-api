import { IRegisterBeachDTO } from './register-beach';

export interface IRegisteredBeachDTO extends Omit<IRegisterBeachDTO, 'position'> {
  id: string;
  position: string;
}
