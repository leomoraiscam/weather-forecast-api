import { User } from "../domain/user/user";
import { RegisterUserResponse } from "../dtos/register-user-response";

export class UserMapper {
  static toDomain({ _id ,props }: User): RegisterUserResponse {
    return {
      id: _id,
      name: props.name.value,
      email: props.email.value,
    }
  }
}
