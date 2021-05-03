import Joi from 'joi';

export type AuthenticationCredentialsValidatorType = {
  login: string;
  password: string;
};

export const AuthenticationCredentialsValidatorSchema = Joi.object({
  login: Joi.string().max(64).required(),
  password: Joi.string().max(64).required(),
});
