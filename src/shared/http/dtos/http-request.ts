export interface IHttpRequest<T> {
  userId?: string;
  body?: T;
  query?: T;
}
