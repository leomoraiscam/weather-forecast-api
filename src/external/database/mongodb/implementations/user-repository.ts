import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { User } from '@src/modules/accounts/domain/user/user';
import { PersistenceUserModel } from '@src/modules/accounts/mapper/dtos/user-model';
import { UserMapper } from '@src/modules/accounts/mapper/user-mapper';
import { IUserRepository } from '@src/modules/accounts/repositories/ports/user-repository';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | undefined> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne<PersistenceUserModel>({ id });

    if (!user) {
      return undefined;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne<PersistenceUserModel>({ email });

    if (!user) {
      return undefined;
    }

    return UserMapper.toDomain(user);
  }

  async create(user: User): Promise<User> {
    const userCollection = mongoHelper.getCollection('users');
    const result = await this.findByEmail(user.email.value);

    if (!result) {
      const data = await UserMapper.toPersistence(user);

      await userCollection.insertOne(data);
    }

    return result;
  }
}
