import { Response, Request, NextFunction } from "express";
import Joi from "joi";

import { makeResponse, statusCode } from "../../../lib";


export const updateJtiJoi = (req: Request, res: Response, next: NextFunction) => {
  const { error } = Joi.object()
    .keys({
      jti: Joi.string()
        .required(),
      notificationToken: Joi.string()
        .optional(),
    })
    .required()
    .validate(req.body);

  if (error) {
    return makeResponse(req, res, statusCode.badRequest, false, error.details[0].message, undefined);
  }
  next();
};
