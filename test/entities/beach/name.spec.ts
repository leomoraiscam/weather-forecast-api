import { Name } from '@src/entities/beach/name';

describe('Beach name object value', () => {
  it('should be able to accept valid name', () => {
    const nameOrError = Name.create('John Doe');

    expect(nameOrError.isRight()).toBeTruthy();
  });

  it('should be able to reject empty name', () => {
    const nameOrError = Name.create(null);

    expect(nameOrError.isLeft()).toBeTruthy();
  });

  it('should be able to reject name with less than 2 characters', () => {
    const nameOrError = Name.create('j');

    expect(nameOrError.isLeft()).toBeTruthy();
  });

  it('should be able to reject name with more than 255 characters', () => {
    const nameOrError = Name.create('d'.repeat(260));

    expect(nameOrError.isLeft()).toBeTruthy();
  });
});
