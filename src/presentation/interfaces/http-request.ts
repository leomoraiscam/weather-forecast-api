export interface IHttpRequest<T = unknown> {
  body?: T;
  userId?: string;
}
