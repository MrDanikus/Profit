import {Request, Response, NextFunction} from 'express';

import {Validator} from '../../helpers/validator';

import {Comments} from '../../models/comment';
import {CommentSearchQuery} from '../../services/search/comments';

import {
  CommentValidatorType,
  CommentValidatorSchema,
  CommentSearchQueryValidatorType,
  CommentSearchQueryValidatorSchema,
} from '../../validators/comment';

export class CommentController {
  /**
   * Comments of provided ad
   */
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {adId} = req.params;
      const queryParams = new Validator<CommentSearchQueryValidatorType>(
        CommentSearchQueryValidatorSchema
      ).validate(req.query);

      const result = await new CommentSearchQuery(adId, queryParams).exec();
      res.json(result);
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;
      const queryParams = new Validator<CommentSearchQueryValidatorType>(
        CommentSearchQueryValidatorSchema
      ).validate(req.query);

      res.json({
        data: await Comments.findById(
          id,
          queryParams.fields?.join(' ')
        ).populate('author', 'name _id role'),
      });
    } catch (err) {
      return next(err);
    }
  }

  static async postComment(req: Request, res: Response, next: NextFunction) {
    try {
      const {adId} = req.params;

      const bodyParams = new Validator<CommentValidatorType>(
        CommentValidatorSchema
      ).validate(req.body);

      const comment = Comments.build(req.user!._id, adId, bodyParams);

      res.json({
        data: await comment.save(),
      });
    } catch (err) {
      return next(err);
    }
  }
}
