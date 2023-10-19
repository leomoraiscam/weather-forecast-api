import { v4 as uuidV4 } from "uuid";
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { InvalidPasswordLengthError } from './errors/invalid-password-length-error'
import { IUserProps } from "./dtos/user-props"

export class User {
  public readonly _id?: string;
  public readonly props: IUserProps;

  private constructor(props: IUserProps, id?: string) {
    this.props = props;
    this._id = id || uuidV4()
  }

  get name() {
    return this.props.name
  }


  static create(
    props: IUserProps,
    id?: string
  ): User | InvalidNameError | InvalidEmailError | InvalidPasswordLengthError {
    return new User(props, id)
  }
}
