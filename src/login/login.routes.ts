import { RouteConfiguration, Request, Base_Reply } from 'hapi';
import * as Joi from 'joi';
import * as boom from 'boom';
import { LoginController } from './login.controller';

const login: RouteConfiguration = {
    method: 'POST',
    path: '/api/login',
    handler: (request: Request, reply: Base_Reply) => {
        LoginController.doLogin(request.payload)
            .then(token => {
                reply(true)
                    .header('X-AUTH-HEADER', token)
                    .code(200);
            })
            .catch(error => {
                reply(boom.unauthorized(error));
            });
    },
    config: {
        validate: {
            payload: {
                login: Joi.string()
                    .min(3)
                    .max(20),
                password: Joi.string()
                    .min(3)
                    .max(20)
            }
        }
    }
};

const getUser: RouteConfiguration = {
    method: 'GET',
    path: '/api/user/{userId}',
    handler: (request: Request, reply: Base_Reply) => {
        LoginController.getUser(request.params.userId)
            .then(user => {
                reply(user).code(200);
            })
            .catch(error => {
                reply(boom.notFound('User not found', error));
            });
    },
    config: {
        validate: {
            params: {
                userId: Joi.string()
            }
        }
    }
};

const postUser: RouteConfiguration = {
    method: 'POST',
    path: '/api/user',
    handler: (request: Request, reply: Base_Reply) => {
        LoginController.addUser(request)
            .then(res => {
                reply(res).code(201);
            })
            .catch(error => {
                reply(boom.badRequest(error));
            });
    }
};

const updateUser: RouteConfiguration = {
    method: 'PUT',
    path: '/api/user',
    handler: (request: Request, reply: Base_Reply) => {
        reply('Updating user').code(200);
    }
};

const routes: RouteConfiguration[] = [login, getUser, postUser, updateUser];

export { routes as LoginRoutes };
