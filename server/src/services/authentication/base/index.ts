import {BaseUserDocument} from '../../../models/users/base';
import ServerError from '../../../utils/errors/server-error';

class AuthenticationError extends ServerError {
  constructor() {
    super(401, 'Authentication error', 'Wrong username or password');
  }
}

export abstract class AuthenticationFactory<
  UserDocument extends BaseUserDocument
> {
  constructor(protected login_: string, protected password_: string) {}
  /**
   * Returns model with `findByLogin` method
   */
  protected abstract getModel(): {
    findByLogin(login: string): Promise<UserDocument | null>;
  };
  /**
   * @throws {AuthenticationError}
   *
   * Tries to authenticate user
   */
  async authenticate(): Promise<UserDocument> {
    const user = await this.getModel().findByLogin(this.login_);

    if (!user) {
      throw new AuthenticationError();
    }
    if (!user.comparePassword(this.password_)) {
      throw new AuthenticationError();
    }
    return user;
  }
}
