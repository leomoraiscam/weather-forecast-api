import { InternalError } from "@src/utils/errors/internal-server-error";

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`)
  }
}
