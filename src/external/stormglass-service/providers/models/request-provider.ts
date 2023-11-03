import { HttpRequest } from "../dtos/http-request"
import { HttpResponse } from "../dtos/http-response"

export interface IRequestProvider {
  get<T>({ url, config }: HttpRequest): Promise<HttpResponse<T>>;
}

