export interface HttpResponse<T> {
  status: number;
  data: T
}