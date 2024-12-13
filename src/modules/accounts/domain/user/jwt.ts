import { sign, verify } from 'jsonwebtoken';

import { Either, left, right } from '@src/shared/core/either';

import { InvalidJWTTokenError } from './errors/invalid-jwt-token-error';
import { User } from './user';

interface IJWTData {
  userId: string;
  token: string;
}

export interface IJWTTokenPayload {
  exp: number;
  sub: string;
}

export class JWT {
  public readonly userId: string;
  public readonly token: string;

  private constructor({ userId, token }: IJWTData) {
    this.userId = userId;
    this.token = token;
  }

  static decodeToken(token: string): Either<InvalidJWTTokenError, IJWTTokenPayload> {
    try {
      const decoded = verify(token, process.env.JWT_SECRET) as IJWTTokenPayload;

      return right(decoded);
    } catch (err) {
      return left(new InvalidJWTTokenError());
    }
  }

  static createFromJWT(token: string): Either<InvalidJWTTokenError, JWT> {
    const jwtPayloadOrError = this.decodeToken(token);

    if (jwtPayloadOrError.isLeft()) {
      return left(jwtPayloadOrError.value);
    }

    const jwt = new JWT({ token, userId: jwtPayloadOrError.value.sub });

    return right(jwt);
  }

  static signUser(user: User): JWT {
    const token = sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const jwt = new JWT({ userId: user.id, token });

    return jwt;
  }
}
