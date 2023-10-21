import { InternalError } from "@src/shared/errors/exceptions/internal-server-error";

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = `Unexpected error when trying to communicate to StormGlass`;
    super(`${internalMessage}: ${message}`)
  }
}