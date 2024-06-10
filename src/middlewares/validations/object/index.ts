import joi from 'joi';
import { makeResponse } from '../../../lib';

export const addObjectValidation = (req: any, res: any, next: any) => {
    const activity = joi.object({
        name: joi.string()
            .required(),
        sizeInByte: joi.string()
            .required(),
        type: joi.string()
            .required(),
        extension: joi.string()
            .required(),
        parentId: joi.string()
            .required(),
        isDeleted: joi.boolean()
            .optional(),
    });

    const { error } = activity.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};

export const updateObjectValidation = (req: any, res: any, next: any) => {
    const activity = joi.object({
        _id: joi.string()
            .required(),
        name: joi.string()
            .optional()
            .allow(""),
        sizeInByte: joi.string()
            .optional()
            .allow(""),
        type: joi.string()
            .optional()
            .allow(""),
        extension: joi.string()
            .optional()
            .allow(""),
        parentId: joi.string()
            .optional()
            .allow(""),
        isDeleted: joi.boolean()
            .optional(),
    });

    const { error } = activity.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};
