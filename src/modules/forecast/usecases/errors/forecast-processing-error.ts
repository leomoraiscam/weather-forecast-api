import { InternalError } from "@src/shared/errors/exceptions/internal-server-error";

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}
