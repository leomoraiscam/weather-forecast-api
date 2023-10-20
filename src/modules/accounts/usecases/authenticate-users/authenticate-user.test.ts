import { Email } from '../../domain/user/email'
import { Name } from '../../domain/user/name'
import { Password } from '../../domain/user/password'
import { User } from '../../domain/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { IUsersRepository } from '../../repositories/users-repository'
import { AuthenticateUser } from './authenticate-user'
import { InvalidEmailOrPasswordError } from './errors/invalid-email-or-password-error'

let usersRepository: IUsersRepository
let authenticateUser: AuthenticateUser

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUser(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const name = Name.create('John Doe') as Name
    const email = Email.create('johndoe@example.com') as Email
    const password = Password.create('123456') as Password

    const userOrError = User.create({
      name,
      email,
      password,
    }) as User

    usersRepository.create(userOrError);

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    )
  })

  it.skip('should not be able to authenticate with invalid e-mail', async () => {
    await expect(() => authenticateUser.execute({
      email: 'invalid@example.com',
      password: '123456',
    })).toThrow(InvalidEmailOrPasswordError)
  })

  it.skip('should not be able to authenticate with invalid password', async () => {
    const name = Name.create('John Doe') as Name
    const email = Email.create('johndoe@example.com') as Email
    const password = Password.create('123456') as Password

    User.create({
      name,
      email,
      password,
    }) as User

    await expect(()=>authenticateUser.execute({
      email: 'john@doe.com',
      password: '123456789',
    })).toThrow(InvalidEmailOrPasswordError)
  })
})
