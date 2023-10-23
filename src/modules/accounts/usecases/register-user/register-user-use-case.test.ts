import { Email } from '../../domain/user/email';
import { Name } from '../../domain/user/name';
import { Password } from '../../domain/user/password';
import { User } from '../../domain/user/user'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository';
import { IUsersRepository } from '../../repositories/users-repository';
import { RegisterUserUseCase } from './register-user-use-case'

let usersRepository: IUsersRepository
let registerUserUseCase: RegisterUserUseCase

describe('Register User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUserUseCase = new RegisterUserUseCase(usersRepository)
  })

  it('should be able to register new user', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: '123456',
    })

    expect(await usersRepository.findByEmail('john@doe.com')).toBeTruthy()
    expect(response.isRight).toBeTruthy()  
  })

  it('should not be able to register new user with invalid data', async () => {
    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'john',
      password: '123',
    })
   
    expect(response.isLeft).toBeTruthy()
  })

  it('should not be able to register new user with existing email', async () => {
    const name = Name.create('John Doe').value as Name
    const email = Email.create('johndoe@example.com').value as Email
    const password = Password.create('123456').value as Password

    const userOrError = User.create({
      name,
      email,
      password
    }).value as User

    usersRepository.create(userOrError);

    const response = await registerUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.isLeft).toBeTruthy();
  })
})
