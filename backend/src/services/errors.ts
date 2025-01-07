export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'User already registered') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}
