import { IUserRepository } from '@src/application/contracts/repositories/users/user-repository';
import { User } from '@src/entities/user/user';
import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { UserMapper } from '@src/infrastructure/database/mongo/repositories/users/mappers/user-mapper';

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | undefined> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne({ id });

    if (!user) {
      return undefined;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userCollection = mongoHelper.getCollection('users');
    const user = await userCollection.findOne({ email });

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
