import { InternalError } from '@src/shared/errors/internal-server-error';
import { ControllerError } from './controller-error';

export class MissingParamError extends InternalError implements ControllerError {
  constructor(param: string) {
    super(`Missing parameter from request: ${param}.`);
  }
}
