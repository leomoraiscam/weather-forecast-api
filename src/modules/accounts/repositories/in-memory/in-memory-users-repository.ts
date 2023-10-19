import { User } from "../../domain/user/user";
import { IUsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements IUsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    const user =  this.items.find((user) => user.props.email.value === email);

    if(!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<User> {
    this.items.push(user);

    return user;
  }
}