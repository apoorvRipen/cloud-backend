import joi from 'joi';
import { makeResponse } from '../../../lib';

export const addRoleValidation = (req: any, res: any, next: any) => {
    const schema = joi.object({
        name: joi.string()
            .required(),
        description: joi.string()
            .required(),
        resources: joi.array().items(joi.string())
            .required(),

    });

    const { error } = schema.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};

export const updateRoleValidation = (req: any, res: any, next: any) => {
    const schema = joi.object({
        _id: joi.string()
            .required(),
        name: joi.string()
            .allow("")
            .optional(),
        description: joi.string()
            .allow("")
            .optional(),
        resources: joi.array().items(joi.string())
            .required()
            .allow("")
            .optional()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};
