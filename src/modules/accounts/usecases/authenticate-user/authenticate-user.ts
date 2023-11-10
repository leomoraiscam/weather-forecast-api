import { JWT } from '../../domain/user/jwt'
import { IUsersRepository } from '../../repositories/users-repository'
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error'
import { AuthenticateUserRequest } from "../../dtos/authenticate-user-request"
import { AuthenticateUserResponse } from "../../dtos/authenticate-user-response";
import { Either, left, right } from '@src/shared/logic/Either'

export class AuthenticateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    email,
    password,
  }: AuthenticateUserRequest): Promise<Either<InvalidEmailOrPasswordError, AuthenticateUserResponse>> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidEmailOrPasswordError())
    }

    const isPasswordValid = await user.password.comparePassword(password)

    if (!isPasswordValid) {
      return left(new InvalidEmailOrPasswordError())
    }

    const { token } = JWT.signUser(user)

    return right({ token })
  }
}
