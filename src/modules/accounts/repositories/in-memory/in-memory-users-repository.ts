import { User } from '../../domain/user/user';
import { IUserRepository } from '../user-repository';

export class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.props.email.value === email);
  }

  async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}
