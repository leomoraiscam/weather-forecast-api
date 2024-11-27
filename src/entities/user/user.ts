import { v4 as uuidV4 } from 'uuid';

import { Either, right } from '@src/shared/logic/either';

import { IUserPropsDTO } from './dtos/user-props';
import { InvalidEmailError } from './errors/invalid-email-error';
import { InvalidNameError } from './errors/invalid-name-error';
import { InvalidPasswordLengthError } from './errors/invalid-password-length-error';

export class User {
  public readonly _id: string;
  public readonly props: IUserPropsDTO;

  constructor(props: IUserPropsDTO, id?: string) {
    this._id = id || uuidV4();
    this.props = props;
  }

  get id() {
    return this._id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(
    props: IUserPropsDTO,
    id?: string,
  ): Either<InvalidNameError | InvalidEmailError | InvalidPasswordLengthError, User> {
    const user = new User(props, id);

    return right(user);
  }
}
