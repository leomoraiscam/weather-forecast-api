import { IRegisterUser } from '@src/application/usecases/users/register-user/contracts/register-user-interface';
import { RegisterUserUseCase } from '@src/application/usecases/users/register-user/register-user-use-case';
import { UserRepository } from '@src/infrastructure/database/mongo/repositories/users/user-repository';

export const makeRegisterUserUseCase = (): IRegisterUser => {
  const userRepository = new UserRepository();
  const registerUserUseCase = new RegisterUserUseCase(userRepository);

  return registerUserUseCase;
};
