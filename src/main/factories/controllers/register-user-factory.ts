import { RegisterUserUseCase } from '@src/application/usecases/users/register-user/register-user-use-case';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';
import { IController } from '@src/main/adapters/ports/controller';
import { RegisterUserController } from '@src/presentation/controllers/register-user-controller';

export const makeRegisterUserController = (): IController => {
  const userRepository = new UserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);
  const registerUserController = new RegisterUserController(registerUserUseCase);

  return registerUserController;
};
