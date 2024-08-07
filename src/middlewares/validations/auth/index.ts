
import joi from 'joi';
import { makeResponse } from '../../../lib';

export const loginValidation = (req: any, res: any, next: any) => {
  const loginCredentials = joi.object({
    email: joi.string()
      .required(),
    password: joi.string()
      .required()
  });
  const { error } = loginCredentials.validate(req.body);
  if (error) {
    return makeResponse(res, 400, false, error.message);
  }
  next();
};

export const forgotPasswordValidation = (req: any, res: any, next: any) => {
  const user = joi.object({
    email: joi.string()
      .email()
      .required()
  });
  const { error } = user.validate(req.body);
  if (error) {
    return makeResponse(res, 400, false, error.message);
  }
  next();
};

export const resetPasswordValidation = (req: any, res: any, next: any) => {
  const reset = joi.object({
    password: joi.string()
      .min(8)
      .required()
  });
  const { error } = reset.validate(req.body);
  if (error) {
    return makeResponse(res, 400, false, error.message);
  }
  next();
};
