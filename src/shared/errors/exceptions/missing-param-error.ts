import { InternalError } from '@src/shared/errors/exceptions/internal-server-error';
import { ControllerError } from '../ports/controller-error';

export class MissingParamError extends InternalError implements ControllerError {
  constructor(param: string) {
    super(`Missing parameter from request: ${param}.`);
  }
}
