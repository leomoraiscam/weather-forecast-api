import { JWT } from '../../domain/user/jwt'
import { IUsersRepository } from '../../repositories/users-repository'
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error'
import { UserAuthenticate } from "../../dtos/authenticate-user"
import { UserToken } from "../../dtos/user-token";
import { Either, left, right } from '@src/shared/logic/Either'
export class AuthenticateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: UserAuthenticate): Promise<Either<InvalidEmailOrPasswordError, UserToken>> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidEmailOrPasswordError())
    }

    const { props } = user;

    const isPasswordValid = await props.password.comparePassword(password)

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError())
    }

    const { token } = JWT.signUser(user)

    return right({ token })
  }
}
