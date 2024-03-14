import { User } from '@src/modules/accounts/domain/user/user';

import { IUserRepository } from '../ports/user-repository';

export class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.props.email.value === email);
  }

  async create(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}
