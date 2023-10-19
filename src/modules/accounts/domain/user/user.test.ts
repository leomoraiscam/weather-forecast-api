import { Email } from './email'
import { Name } from './name'
import { Password } from './password'
import { User } from './user'

const name = Name.create('John Doe') as Name
const email = Email.create('johndoe@example.com') as Email
const password = Password.create('123456') as Password

describe('User Domain entity', () => {
  it('should be able to create new user', () => {
    const userOrError = User.create({
      name,
      email,
      password,
    }) as User

    expect(userOrError).toHaveProperty('_id')
  })
})
