import { RegisterUserUseCase } from "@src/modules/accounts/usecases/register-user/register-user-use-case"
import { RegisterUserController } from "@src/modules/accounts/usecases/register-user/register-user-controller";
import { InMemoryUsersRepository } from "@src/modules/accounts/repositories/in-memory/in-memory-users-repository"
import { Controller } from "../ports/controller";

export const makeRegisterUserController = (): Controller => {
  const inMemoryUsersRepository = new InMemoryUsersRepository()
  const registerUserUseCase = new RegisterUserUseCase(inMemoryUsersRepository);
  const registerUserController = new RegisterUserController(registerUserUseCase);

  return registerUserController;
}