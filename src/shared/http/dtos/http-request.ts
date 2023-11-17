export interface HttpRequest<T> {
  params?: T
  body?: T;
  userId?: string
}
