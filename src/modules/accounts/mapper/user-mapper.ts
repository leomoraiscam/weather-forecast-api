import { User } from "../domain/user/user";
import { RegisterUser } from "../dtos/register-user-response";

export class UserMapper {
  static toDomain({ _id ,props }: User): RegisterUser {
    return {
      id: _id,
      name: props.name.value,
      email: props.email.value,
    }
  }
}
