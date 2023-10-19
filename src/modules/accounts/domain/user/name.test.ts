import { Name } from "./name";
import { InvalidNameError } from "./errors/invalid-name-error";


describe('User Name Object Value', () => {
  it('should accept valid name', () => {
    const nameOrError = Name.create('John Doe');

    expect(nameOrError).toHaveProperty('name');
  })

  it('should reject name with less than 2 characters', () => {
    expect(() => Name.create('j')).toThrow(InvalidNameError);
  })

  it('should reject name with more than 255 characters', () => {
    expect(() => Name.create('d'.repeat(260))).toThrow(InvalidNameError);
  })
})