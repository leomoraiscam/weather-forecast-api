import { User } from "../../domain/user/user";
import { IUsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements IUsersRepository {
  users: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user =  this.users.find((user) => user.props.email.value === email);

    if(!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}