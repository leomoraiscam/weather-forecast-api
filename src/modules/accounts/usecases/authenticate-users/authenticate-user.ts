import { JWT } from '../../domain/user/jwt'
import { User } from '../../domain/user/user'
import { IUsersRepository } from '../../repositories/users-repository'
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error'
import { UserAuthenticate } from "../../dtos/authenticate-user"
import { UserToken } from "../../dtos/user-token";
export class AuthenticateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: UserAuthenticate): Promise<UserToken> {
    const user = await this.usersRepository.findByEmail(email) as User

    if (!user) {
      throw new InvalidEmailOrPasswordError()
    }

    const { props } = user;

    const isPasswordValid = await props.password.comparePassword(password)

    if (!isPasswordValid) {
      throw new InvalidEmailOrPasswordError()
    }

    const { token } = JWT.signUser(user)

    return { token }
  }
}
