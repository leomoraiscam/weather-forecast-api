import { AuthenticateUser } from "@src/modules/accounts/usecases/authenticate-users/authenticate-user"
import { AuthenticateUserController } from "@src/modules/accounts/usecases/authenticate-users/authenticate-user-controller";
import { InMemoryUsersRepository } from "@src/modules/accounts/repositories/in-memory/in-memory-users-repository"
import { Controller } from "../ports/controller";

export const makeAuthenticateUserController = (): Controller => {
  const inMemoryUsersRepository = new InMemoryUsersRepository()
  const authenticateUser = new AuthenticateUser(inMemoryUsersRepository);
  const authenticateUserController = new AuthenticateUserController(authenticateUser);

  return authenticateUserController;
}