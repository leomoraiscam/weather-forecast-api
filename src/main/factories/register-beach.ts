import { RegisterBeachUseCase } from "@src/modules/forecast/usecases/create-beach/register-beach-use-case"
import { RegisterBeachController } from "@src/modules/forecast/usecases/create-beach/register-beach-controller";
import { BeachRepository } from "@src/modules/forecast/repositories/implementations/beach-repository"
import { Controller } from "../ports/controller";

export const makeRegisterBeachController = (): Controller => {
  const beachRepository = new BeachRepository()
  const registerBeachUseCase = new RegisterBeachUseCase(beachRepository);
  const registerBeachController = new RegisterBeachController(registerBeachUseCase);

  return registerBeachController;
}