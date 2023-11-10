import { User } from "../domain/user/user"

export class UserMapper {
  static async toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      password: await user.password.getHashedValue(),
    }
  }
}
