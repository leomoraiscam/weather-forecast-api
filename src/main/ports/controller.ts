import { HttpResponse } from "@src/modules/forecast/usecases/ports/http/http-response";

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse<T>>
}
