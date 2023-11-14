export interface EnsureAuthenticatedMiddlewareRequest {
  accesstoken: string
}

export interface DecodedJwt {
  sub: string
}