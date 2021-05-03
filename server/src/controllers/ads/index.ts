import {Request, Response, NextFunction} from 'express';

import {Validator} from '../../helpers/validator';

import {Ads} from '../../models/ad';
import {AdSearchQuery} from '../../services/search/ads';

import {
  AdSearchQueryValidatorType,
  AdSearchQueryValidatorSchema,
  AdPatchValidatorType,
  AdPatchValidatorSchema,
  AdPostValidatorType,
  AdPostValidatorSchema,
} from '../../validators/ad';

import ServerError from '../../utils/errors/server-error';

export class AdController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const queryParams = new Validator<AdSearchQueryValidatorType>(
        AdSearchQueryValidatorSchema
      ).validate(req.query);

      const result = await new AdSearchQuery(queryParams).exec();
      res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const {adId} = req.params;

      const queryParams = new Validator<AdSearchQueryValidatorType>(
        AdSearchQueryValidatorSchema
      ).validate(req.query);

      res.json({
        data: await Ads.findById(adId, queryParams.fields?.join(' ')).populate(
          'vendor',
          'name _id role'
        ),
      });
    } catch (err) {
      return next(err);
    }
  }

  static async patchById(req: Request, res: Response, next: NextFunction) {
    try {
      const {adId} = req.params;

      const bodyParams = new Validator<AdPatchValidatorType>(
        AdPatchValidatorSchema
      ).validate(req.body);

      const ad = await Ads.findById(adId, '_id vendor isDeleted');
      if (!ad) {
        throw new ServerError(404, 'Ad not found', 'Wrong id');
      }
      if (ad.isDeleted) {
        throw new ServerError(
          410,
          'Ad is deleted',
          'Ad has been previously deleted'
        );
      }

      if (ad.vendor !== req.user!._id) {
        throw new ServerError(
          403,
          'Access denied',
          'You have no permission to access this resource'
        );
      }

      res.json({
        data: await Ads.patchById(adId, bodyParams),
      });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const {adId} = req.params;

      const ad = await Ads.findById(adId, '_id vendor isDeleted');
      if (!ad) {
        throw new ServerError(404, 'Ad not found', 'Wrong id');
      }
      if (ad.isDeleted) {
        throw new ServerError(
          410,
          'Ad is deleted',
          'Ad has been previously deleted'
        );
      }

      if (ad.vendor !== req.user!._id) {
        throw new ServerError(
          403,
          'Access denied',
          'You have no permission to access this resource'
        );
      }

      await Ads.deleteById(adId);

      res.status(204).end();
    } catch (err) {
      return next(err);
    }
  }

  static async postAd(req: Request, res: Response, next: NextFunction) {
    try {
      const bodyParams = new Validator<AdPostValidatorType>(
        AdPostValidatorSchema
      ).validate(req.body);

      const ad = Ads.build(req.user!._id, bodyParams);

      res.json({
        data: await ad.save(),
      });
    } catch (err) {
      return next(err);
    }
  }
}
