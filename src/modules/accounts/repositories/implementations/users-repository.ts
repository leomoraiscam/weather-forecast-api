import { User } from '../../domain/user/user';
import { UserMapper } from '../../mapper/user-mapper';
import { IUsersRepository } from '../users-repository';

import { mongoHelper } from '@src/external/repositories/mongodb/helpers/mongo-helper';

export class UserRepository implements IUsersRepository {
  async findByEmail(email: string): Promise<User> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne<User>({ email });

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User): Promise<User> {
    const userCollection = mongoHelper.getCollection('users');
    const result = await this.findByEmail(user.email.value);

    if (!result) {
      const data = await UserMapper.toPersistence(user)

      await userCollection.insertOne(data);
    }

    return result
  }
}
