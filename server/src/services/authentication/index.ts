import {Users, BaseUserDocument} from '../../models/users';
import ServerError from '../../utils/errors/server-error';

class AuthenticationError extends ServerError {
  constructor() {
    super(401, 'Authentication error', 'Wrong username or password');
  }
}

export class Authentication<UserType extends BaseUserDocument> {
  constructor(protected login_: string, protected password_: string) {}
  /**
   * @throws {AuthenticationError}
   *
   * Tries to authenticate user
   */
  async authenticate(): Promise<UserType> {
    const user = (await Users.findByLogin(this.login_)) as UserType;

    if (!user) {
      throw new AuthenticationError();
    }
    if (!user.comparePassword(this.password_)) {
      throw new AuthenticationError();
    }
    return user;
  }
}
