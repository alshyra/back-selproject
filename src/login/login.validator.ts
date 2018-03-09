import * as Joi from 'joi';

export const createUserModel = Joi.object().keys({
    email: Joi.string()
        .email()
        .trim()
        .required(),
    login: Joi.string().required(),
    password: Joi.string()
        .trim()
        .required()
});
