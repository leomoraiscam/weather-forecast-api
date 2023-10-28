import { sign, verify } from 'jsonwebtoken'

import { InvalidJWTTokenError } from './errors/invalid-jwt-token-error'
import { User } from './user'
import { Either, left, right } from '@src/shared/logic/Either'

interface JWTData {
  userId: string
  token: string
}

export interface JWTTokenPayload {
  exp: number
  sub: string
}

export class JWT {
  public readonly userId: string
  public readonly token: string

  private constructor({ userId, token }: JWTData) {
    this.userId = userId
    this.token = token
  }

  static decodeToken(
    token: string
  ): Either<InvalidJWTTokenError, JWTTokenPayload> {
    try {
      const decoded = verify(token, 'secret-key') as JWTTokenPayload

      return right(decoded)
    } catch (err) {
      return left(new InvalidJWTTokenError())
    }
  }

  static createFromJWT(token: string): Either<InvalidJWTTokenError, JWT> {
    const jwtPayloadOrError = this.decodeToken(token)

    if (jwtPayloadOrError.isLeft()) {
      return left(jwtPayloadOrError.value)
    }

    const jwt = new JWT({ token, userId: jwtPayloadOrError.value.sub })

    return right(jwt)
  }

  static signUser(user: User): JWT {
    const token = sign({}, 'secret-key', {
      subject: user._id,
      expiresIn: '1d',
    })

    const jwt = new JWT({ userId: user._id, token })

    return jwt
  }
}
