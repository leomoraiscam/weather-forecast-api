import { User } from '../../domain/user/user';
import { PersistenceUserModel } from '../../mapper/dtos/users-model';
import { UserMapper } from '../../mapper/user-mapper';
import { IUsersRepository } from '../users-repository';

import { mongoHelper } from '@src/external/repositories/mongodb/helpers/mongo-helper';

export class UserRepository implements IUsersRepository {
  async findById(id: string): Promise<User | null> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne<PersistenceUserModel>({ id });

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne<PersistenceUserModel>({ email });

    if (!user) {
      return null
    }

    return UserMapper.toDomain(user)
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
