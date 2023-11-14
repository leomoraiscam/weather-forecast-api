import { HttpResponse } from "@src/shared/http/dtos/http-response";

export interface Controller<T = any> {
  handle: (request: T) => Promise<HttpResponse<T>>
}
