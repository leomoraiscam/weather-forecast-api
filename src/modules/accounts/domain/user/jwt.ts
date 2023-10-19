import { sign, verify } from 'jsonwebtoken'

import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'
import { User } from './user'

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
  ): InvalidJWTTokenError | JWTTokenPayload {
    try {
      const decoded = verify(token, 'secret-key') as JWTTokenPayload

      return decoded
    } catch (err) {
      throw new InvalidJWTTokenError()
    }
  }

  static createFromJWT(token: string): InvalidJWTTokenError | JWT {
    const jwtPayloadOrError = this.decodeToken(token)

    if (jwtPayloadOrError instanceof InvalidJWTTokenError) {
      throw new InvalidJWTTokenError()
    }

    const jwt = new JWT({ token, userId: jwtPayloadOrError.sub })

    return jwt
  }

  static signUser(user: User): JWT {
    const token = sign({}, 'secret-key', {
      subject: user._id,
      expiresIn: '1d',
    })

    const jwt = new JWT({ userId: 'userId', token })

    return jwt
  }
}
