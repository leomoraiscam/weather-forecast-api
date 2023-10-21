import { Email } from "../../domain/user/email";
import { Name } from "../../domain/user/name";
import { Password } from "../../domain/user/password";
import { User } from "../../domain/user/user";
import { RegisterUserResponse } from "../../dtos/register-user-response";
import { IUsersRepository } from "../../repositories/users-repository";
import { AccountAlreadyExistsError } from "./errors/account-already-exists-error";
import { UserMapper } from "../../mapper/user-mapper"
import { RegisterUserRequest } from "../../dtos/register-user";

export class RegisterUserUseCase {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ name, email, password }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const nameOrError = Name.create(name) as Name
    const emailOrError = Email.create(email) as Email
    const passwordOrError = Password.create(password) as Password

    const userOrError = User.create({
      name: nameOrError,
      email: emailOrError,
      password: passwordOrError,
    }) as User
    
    const user = userOrError.props

    const userAlreadyExists = await this.usersRepository.findByEmail(
      user.email.value
    )

    if (userAlreadyExists) {
      throw new AccountAlreadyExistsError(user.email.value)
    }

    await this.usersRepository.create(userOrError)

    return UserMapper.toDomain(userOrError);
  }
}