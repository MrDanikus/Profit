import {Request, Response, NextFunction} from 'express';

import {Validator} from '../../helpers/validator';
import {JSONWebTokenHelper} from '../../helpers/jwt';

import {Authentication} from '../../services/authentication';

import {
  AuthenticationCredentialsValidatorType,
  AuthenticationCredentialsValidatorSchema,
} from '../../validators/authentication';

export class AuthenticationController {
  static async postAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const credentials = new Validator<AuthenticationCredentialsValidatorType>(
        AuthenticationCredentialsValidatorSchema
      ).validate(req.body);

      const user = (
        await new Authentication(
          credentials.login,
          credentials.password
        ).authenticate()
      ).toObject({getters: true});

      res.json({
        type: 'user',
        data: {
          ...user,
          token: await new JSONWebTokenHelper().encode(user),
        },
      });
    } catch (err) {
      return next(err);
    }
  }
}
