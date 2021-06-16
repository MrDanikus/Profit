import Joi from 'joi';

import {Comment} from '../../models/comment';
import {CommentSearchQueryOptions} from '../../services/search/comments';

export type CommentValidatorType = Pick<Comment, 'content'>;

export const CommentValidatorSchema = Joi.object({
  content: Joi.string().max(512).required(),
});

export type CommentSearchQueryValidatorType = CommentSearchQueryOptions;

export const CommentSearchQueryValidatorSchema = Joi.object({
  page: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  fields: Joi.array().items(
    Joi.string().valid('_id', 'ad', 'author', 'content', 'createdAt')
  ),
});
