import { v4 as uuidV4 } from "uuid";
import { InvalidEmailError } from './errors/invalid-email-error'
import { InvalidNameError } from './errors/invalid-name-error'
import { InvalidPasswordLengthError } from './errors/invalid-password-length-error'
import { IUserProps } from "./dtos/user-props"
import { Either, right } from "@src/shared/logic/Either";

export class User {
  public readonly _id: string;
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
  ): Either<
    InvalidNameError | InvalidEmailError | InvalidPasswordLengthError,
    User
  > {
    return right(new User(props, id))
  }
}
