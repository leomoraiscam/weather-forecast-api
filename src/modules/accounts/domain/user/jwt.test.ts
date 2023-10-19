import { Email } from './email'
import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'
import { JWT, JWTTokenPayload } from './jwt'
import { Name } from './name'
import { Password } from './password'
import { User } from './user'

const name = Name.create('John Doe') as Name
const email = Email.create('johndoe@example.com') as Email
const password = Password.create('123456') as Password

describe('JWT domain entity', () => {
  it('should be able to create new user', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError as User

    const jwt = JWT.signUser(user)

    expect(jwt.token).toEqual(expect.any(String))
  })

  it('should be able to initialize JWT from created token', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError as User

    const createdJwt = JWT.signUser(user)

    const jwtOrError = JWT.createFromJWT(createdJwt.token)
    const jwt = jwtOrError as JWT

    expect(jwt.userId).toBe(user._id)
  })

  it('should not be able to initialize JWT from invalid token', () => {
    expect(() => JWT.createFromJWT('invalid-token')).toThrow(InvalidJWTTokenError)
  })

  it('should be able to decode JWT token', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    })

    const user = userOrError as User

    const jwt = JWT.signUser(user)

    const decodedOrError = JWT.decodeToken(jwt.token)
    const decoded = decodedOrError as JWTTokenPayload

    expect(decoded.exp).toEqual(expect.any(Number))
  })

  it('should not be able to decode invalid JWT token', () => {
    expect(()=>JWT.decodeToken('invalid-token')).toThrow(InvalidJWTTokenError)
  })
})
