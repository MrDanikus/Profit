import Joi from 'joi';

import {Ad} from '../../models/ad';
import {AdSearchQueryOptions} from '../../services/search/ads';

export type AdPatchValidatorType = Partial<
  Omit<Ad, '_id' | 'likes' | 'vendor' | 'createdAt' | 'isDeleted'>
>;

export const AdPatchValidatorSchema = Joi.object({
  name: Joi.string().max(128),
  description: Joi.string().max(256),
  link: Joi.string().uri(),
  tags: Joi.array().items(Joi.string().max(64)),
  discount: Joi.number().integer().min(0).max(100),
  promocode: Joi.string().max(64),
  icon: Joi.string(),
  expiresAt: Joi.date().iso(),
});

export type AdPostValidatorType = Omit<
  Ad,
  '_id' | 'likes' | 'vendor' | 'createdAt' | 'isDeleted'
>;

export const AdPostValidatorSchema = Joi.object({
  name: Joi.string().max(128).required(),
  description: Joi.string().max(256).required(),
  link: Joi.string().uri().required(),
  tags: Joi.array().items(Joi.string().max(64)).required(),
  discount: Joi.number().integer().min(0).max(100).required(),
  promocode: Joi.string().max(64).required(),
  icon: Joi.string().required(),
  expiresAt: Joi.date().iso().required(),
});

export type AdSearchQueryValidatorType = AdSearchQueryOptions;

export const AdSearchQueryValidatorSchema = Joi.object({
  q: Joi.string(),
  tags: Joi.alternatives(
    Joi.array().items(Joi.string().max(64)),
    Joi.string().max(64)
  ),
  vendorId: Joi.string().length(24).hex(),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
  sort: Joi.string().valid('date', 'rate'),
  sortOrder: Joi.number().valid(1, -1),
  page: Joi.number().integer().min(0),
  limit: Joi.number().integer().min(1),
  fields: Joi.array().items(
    Joi.string().valid(
      '_id',
      'name',
      'description',
      'link',
      'vendor',
      'tags',
      'discount',
      'promocode',
      'icon',
      'likes',
      'expiresAt',
      'createdAt',
      'isDeleted'
    )
  ),
});
