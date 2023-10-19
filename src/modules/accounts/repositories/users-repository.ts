import { User } from "../domain/user/user"

export interface IUsersRepository {
  create(user: User): Promise<User>
  findByEmail(email: string): Promise<User | null>
}