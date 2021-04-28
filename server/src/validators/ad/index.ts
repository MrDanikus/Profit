import Joi from 'joi';

import {Ad} from '../../models/ad';

export type AdPatchValidatorType = Partial<
  Omit<Ad, '_id' | 'likes' | 'vendorId' | 'createdAt' | 'isDeleted'>
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
  '_id' | 'likes' | 'vendorId' | 'createdAt' | 'isDeleted'
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
