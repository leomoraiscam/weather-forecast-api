import { AuthenticateUser } from "@src/modules/accounts/usecases/authenticate-user/authenticate-user"
import { AuthenticateUserController } from "@src/modules/accounts/usecases/authenticate-user/authenticate-user-controller";
import { UserRepository } from "@src/modules/accounts/repositories/implementations/users-repository"
import { Controller } from "../../adapters/ports/controller";

export const makeAuthenticateUserController = (): Controller => {
  const userRepository = new UserRepository()
  const authenticateUser = new AuthenticateUser(userRepository);
  const authenticateUserController = new AuthenticateUserController(authenticateUser);

  return authenticateUserController;
}