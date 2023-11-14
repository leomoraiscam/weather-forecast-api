import { HttpResponse } from "../dtos/http-response";

export interface Middleware<T = any, U = any> {
  handle: (httpRequest: T, httpBody?: U) => Promise<HttpResponse<any> | false>
}
