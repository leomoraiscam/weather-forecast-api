export interface IHttpRequest<T> {
  params?: T;
  body?: T;
  userId?: string;
}
