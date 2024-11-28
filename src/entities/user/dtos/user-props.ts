import { Email } from '../email';
import { Name } from '../name';
import { Password } from '../password';

export interface IUserPropsDTO {
  name: Name;
  email: Email;
  password: Password;
}
