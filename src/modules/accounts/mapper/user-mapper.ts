import { User } from "../domain/user/user";
import { RegisterUser } from "../dtos/register-user-response";

export class UserMapper {
  static toDomain({ id , props: { name, email } }: User): RegisterUser {
    return {
      id,
      name: name.value,
      email: email.value,
    }
  }
}
