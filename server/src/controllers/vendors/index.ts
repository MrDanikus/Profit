import {Request, Response, NextFunction} from 'express';

import {Users} from '../../models/users';
import {Role} from '../../models/users/role';

export class VendorController {
  /**
   * All vendors
   */
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const vendors = await Users.find(
        {role: Role.VENDOR},
        '_id role name'
      ).lean();
      res.json({
        type: 'user',
        count: vendors.length,
        data: vendors,
      });
    } catch (err) {
      return next(err);
    }
  }
}
