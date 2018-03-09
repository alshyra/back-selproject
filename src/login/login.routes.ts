import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as boom from 'boom';
import { LoginController } from './login.controller';
import { IRequest, ILoginRequest } from '../interfaces/request';

const login: Hapi.ServerRoute = {
    method: 'POST',
    path: '/api/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login',
        notes: 'Log user',
        handler: (request: ILoginRequest, reply) => {
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

const getUser: Hapi.ServerRoute = {
    method: 'GET',
    path: '/api/users/{userId}',
    config: {
        tags: ['api', 'users'],
        description: 'Get User',
        notes: 'Get an existing User from id',
        handler: LoginController.getUser,
        validate: {
            params: {
                userId: Joi.string()
            }
        }
    }
};

const getUsers: Hapi.ServerRoute = {
    method: 'GET',
    path: '/api/users/',
    config: {
        tags: ['api', 'users'],
        description: 'Get Users',
        notes: 'Get user list',
        handler: LoginController.getUser
    }
};

const postUser: Hapi.ServerRoute = {
    method: 'POST',
    path: '/api/users',
    config: {
        tags: ['api', 'users'],
        description: 'Create User',
        notes: 'Create a new User',
        handler: (request: ILoginRequest, reply) => {
            LoginController.addUser(request)
                .then(res => {
                    reply(res).code(201);
                })
                .catch(error => {
                    reply(boom.badRequest(error));
                });
        }
    }
};

const updateUser: Hapi.ServerRoute = {
    method: 'PUT',
    path: '/api/users',
    config: {
        tags: ['api', 'users'],
        description: 'Update User Login',
        notes: 'Update user',
        handler: (request: IRequest, reply) => {
            reply('Updating user').code(200);
        },
        validate: {
            payload: Joi.object({
                a: Joi.number(),
                b: Joi.number()
            }).label('Sum')
        }
    }
};

const routes: Hapi.ServerRoute[] = [login, getUser, postUser, updateUser];

export { routes as LoginRoutes };
