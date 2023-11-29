export interface IEnsureAuthenticatedMiddlewareRequest {
  accesstoken: string;
}

export interface IDecodedJwt {
  sub: string;
}
