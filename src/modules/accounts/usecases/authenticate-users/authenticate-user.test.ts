import { Email } from '../../domain/user/email'
import { Name } from '../../domain/user/name'
import { Password } from '../../domain/user/password'
import { User } from '../../domain/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { IUsersRepository } from '../../repositories/users-repository'
import { AuthenticateUser } from './authenticate-user'

let usersRepository: IUsersRepository
let authenticateUser: AuthenticateUser

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUser(usersRepository)
  })

  it('should be able to authenticate', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('johndoe@example.com').value as Email
    const password = Password.create('123456').value as Password

    const userOrError = User.create({
      name,
      email,
      password,
    }).value as User

    usersRepository.create(userOrError);

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.value).toEqual(
      expect.objectContaining({ token: expect.any(String) })
    )
  })

  it('should not be able to authenticate with invalid e-mail', async () => {
    const response = await authenticateUser.execute({
      email: 'invalid@example.com',
      password: '123456',
    })

    expect(response.isLeft).toBeTruthy()
  })

  it('should not be able to authenticate with invalid password', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('johndoe@example.com').value as Email
    const password = Password.create('123456').value as Password

    User.create({
      name,
      email,
      password,
    }).value as User

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456789',
    })

    expect(response.isLeft).toBeTruthy()
  })
})
