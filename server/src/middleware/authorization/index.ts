import {Request, Response, NextFunction} from 'express';

import {Users, BaseUser, BaseUserDocument} from '../../models/users';
import {Role as UserRole} from '../../models/users/role';
import {JSONWebTokenHelper} from '../../helpers/jwt';

import {Middleware} from '../base';

import ServerError from '../../utils/errors/server-error';

declare module 'express' {
  export interface Request {
    token?: string;
    user?: BaseUserDocument;
  }
}

class AuthorizaionError extends ServerError {
  constructor() {
    super(
      401,
      'Authorization required',
      'No authorization headers was provided'
    );
  }
}

class AuthorizaionNoPermissionError extends ServerError {
  constructor() {
    super(
      403,
      'Access denied',
      'You have no permission to access this resource'
    );
  }
}

export class Authorization {
  static client(): AuthorizationInstance {
    return new AuthorizationInstance(UserRole.CLIENT);
  }
  static vendor(): AuthorizationInstance {
    return new AuthorizationInstance(UserRole.VENDOR);
  }
  static admin(): AuthorizationInstance {
    return new AuthorizationInstance(UserRole.ADMIN);
  }

  /**
   * Builds from jwt payload mongoose document.
   *
   * @param payload user data from jwt
   * @return builded user model
   */
  static userPayloadAsAnyUser(payload: BaseUser): BaseUserDocument {
    const user = new Users(payload);

    user.isNew = false;
    return user;
  }
  /**
   * Tries to decode request bearer token.
   *
   * @throws
   * @param req express request object
   */
  static async getUserPayload(req: Request): Promise<BaseUser | null> {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      const bearerToken = bearerHeader.split(' ')[1];
      req.token = bearerToken;
      return await new JSONWebTokenHelper().decode(bearerToken);
    } else {
      return null;
    }
  }
}

export class AuthorizationInstance extends Middleware {
  private allowedUserTypes: UserRole[];
  private requiredFlag = false;
  private relevantFlag = false;

  /**
   * Constructs authorization instance with specified user role.
   */
  constructor(userType: UserRole) {
    super();
    this.allowedUserTypes = [userType];
  }
  /**
   * Allows client authorization.
   */
  client(): this {
    this.allowedUserTypes.push(UserRole.CLIENT);
    return this;
  }
  /**
   * Allows vendor authorization.
   */
  vendor(): this {
    this.allowedUserTypes.push(UserRole.VENDOR);
    return this;
  }
  /**
   * Allows admin authorization.
   */
  admin(): this {
    this.allowedUserTypes.push(UserRole.ADMIN);
    return this;
  }
  /**
   * Disallows unauthorized access.
   */
  required(): this {
    this.requiredFlag = true;
    return this;
  }
  /**
   * Forces middleware to set to the `req.user`
   * relevant user document.
   */
  relevant(): this {
    this.relevantFlag = true;
    return this;
  }

  /**
   * Express middleware that performs authorization checks and validations.
   */
  public async middleware(
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(this);
    let payload: BaseUser | null = null;

    /** Decode request bearer token */
    try {
      payload = await Authorization.getUserPayload(req);
    } catch (err) {
      if (this.requiredFlag) {
        return next(err);
      } else {
        return next();
      }
    }
    if (!payload) {
      if (this.requiredFlag) {
        return next(new AuthorizaionError());
      } else {
        return next();
      }
    }

    /** Check if user's type is allowed */
    if (!this.allowedUserTypes.includes(payload.role)) {
      if (this.requiredFlag) {
        return next(new AuthorizaionNoPermissionError());
      } else {
        return next();
      }
    }

    /** Set user to user document */
    req.user = this.relevantFlag
      ? (await Users.findById(payload._id))!
      : Authorization.userPayloadAsAnyUser(payload);

    return next();
  }
}
