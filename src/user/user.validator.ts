import * as Joi from 'joi';

export const createUserModel = Joi.object().keys({
    email: Joi.string()
        .email()
        .trim()
        .required(),
    password: Joi.string()
        .trim()
        .required()
});

export const jwtValidator = Joi.object({'authorization': Joi.string().required()}).unknown();
