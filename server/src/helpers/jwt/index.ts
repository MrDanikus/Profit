import config from 'config';
import jsonwebtoken from 'jsonwebtoken';

import {BaseUser} from '../../models/users';
import ServerError from '../../utils/errors/server-error';

class JSONWebTokenError extends ServerError {
  constructor() {
    super(
      401,
      'Authentication required',
      'Authorization token has been malformed or has expired'
    );
  }
}

export class JSONWebTokenHelper<UserType extends BaseUser> {
  private static VERSION: string = config.get('jwt.version');
  private static PRIVATE_KEY: string = config.get('jwt.private_key');
  private static PUBLIC_KEY: string = config.get('jwt.public_key');
  private static ALGORITHM: jsonwebtoken.Algorithm = config.get(
    'jwt.algorithm'
  );
  private static TOKEN_TTL: string = config.get('jwt.token_ttl');
  /**
   * Generate JWT of provided user
   *
   * @param user user data that will be encoded
   *
   * @return json web token of user
   */
  encode(user: UserType): Promise<string> {
    return new Promise(resolve => {
      resolve(
        jsonwebtoken.sign(
          {
            ...user,
            __jwtv: JSONWebTokenHelper.VERSION,
          },
          JSONWebTokenHelper.PRIVATE_KEY,
          {
            expiresIn: JSONWebTokenHelper.TOKEN_TTL,
            algorithm: JSONWebTokenHelper.ALGORITHM,
          }
        )
      );
    });
  }
  /**
   * Decodes provided jwt
   *
   * @throws {JSONWebTokenError}
   * @param token jwt token
   *
   * @return decoded token payload
   */
  async decode(token: string): Promise<UserType> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(
        token,
        JSONWebTokenHelper.PUBLIC_KEY,
        {
          algorithms: [JSONWebTokenHelper.ALGORITHM],
        },
        (err, decoded) => {
          if (err) {
            reject(new JSONWebTokenError());
          } else {
            if (
              decoded &&
              (decoded as {__jwtv: string}).__jwtv >= JSONWebTokenHelper.VERSION
            ) {
              resolve(decoded as UserType);
            } else {
              reject(new JSONWebTokenError());
            }
          }
        }
      );
    });
  }
}
