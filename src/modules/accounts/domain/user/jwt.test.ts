import { createUser } from '@test/factories/user-factory';

import { InvalidJWTTokenError } from './errors/invalid-jwt-token-error';
import { JWT, IJWTTokenPayload } from './jwt';

describe('JWT domain entity', () => {
  it('should be able to create new user', () => {
    const user = createUser();

    const jwt = JWT.signUser(user);

    expect(jwt.token).toEqual(expect.any(String));
  });

  it('should be able to initialize JWT from created token', () => {
    const user = createUser();

    const createdJwt = JWT.signUser(user);

    const jwtOrError = JWT.createFromJWT(createdJwt.token);
    const jwt = jwtOrError.value as JWT;

    expect(jwtOrError.isRight()).toBe(true);
    expect(jwt.userId).toBe(user.id);
  });

  it('should not be able to initialize JWT from invalid token', () => {
    const jwtOrError = JWT.createFromJWT('invalid-token');

    expect(jwtOrError.isLeft()).toBe(true);
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError());
  });

  it('should be able to decode JWT token', () => {
    const user = createUser();

    const jwt = JWT.signUser(user);

    const decodedOrError = JWT.decodeToken(jwt.token);
    const decoded = decodedOrError.value as IJWTTokenPayload;

    expect(decodedOrError.isRight()).toBe(true);
    expect(decoded.sub).toBe(user.id);
    expect(decoded.exp).toEqual(expect.any(Number));
  });

  it('should not be able to decode invalid JWT token', () => {
    const jwtOrError = JWT.decodeToken('invalid-token');

    expect(jwtOrError.isLeft()).toBe(true);
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError());
  });
});
