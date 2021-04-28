import Joi from 'joi';

import {Comment} from '../../models/comment';

export type CommentValidatorType = Pick<Comment, 'content'>;

export const CommentValidatorSchema = Joi.object({
  content: Joi.string().max(512).required(),
});
