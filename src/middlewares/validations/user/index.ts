import joi from 'joi';
import { makeResponse } from '../../../lib';

export const addUserValidation = (req: any, res: any, next: any) => {
    const activity = joi.object({
        firstName: joi.string()
            .required(),
        lastName: joi.string()
            .required(),
        gender: joi.string()
            .valid('MALE', 'FEMALE', 'TRANSGENDER')
            .required(),
        contact: joi.object()
            .keys({
                email: joi.string().required(),
                mobileNumber: joi.object()
                    .keys({
                        dialCode: joi.string(),
                        iso2: joi.string().max(2),
                        country: joi.string(),
                        number: joi.string(),
                    })
                    .required()
            })
            .required()
    });

    const { error } = activity.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};

export const updateUserValidation = (req: any, res: any, next: any) => {
    const activity = joi.object({
        _id: joi.string()
            .required(),
        firstName: joi.string()
            .allow('')
            .optional(),
        gender: joi.string()
            .valid('MALE', 'FEMALE', 'TRANSGENDER')
            .allow('')
            .optional(),
        contact: joi.object()
            .keys({
                email: joi.string()
                    .allow('')
                    .optional(),
                mobileNumber: joi.object()
                    .keys({
                        dialCode: joi.string(),
                        iso2: joi.string().max(2),
                        country: joi.string(),
                        number: joi.string(),
                    })
                    .optional()
            })
            .allow('')
            .optional()
    });

    const { error } = activity.validate(req.body);
    if (error) {
        return makeResponse(res, 400, false, error.message);
    }
    next();
};
