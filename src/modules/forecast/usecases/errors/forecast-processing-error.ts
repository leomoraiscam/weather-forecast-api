import { InternalError } from "@src/shared/errors/internal-server-error";

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}
