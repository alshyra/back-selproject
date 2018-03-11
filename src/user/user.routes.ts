import * as Hapi from 'hapi';
import * as Joi from 'joi';
import * as Boom from 'boom';
import { UserController } from './user.controller';
import { IRequest, ILoginRequest } from '../interfaces/request';
import { createUserModel, jwtValidator } from './user.validator';

const userController = new UserController();

const login: Hapi.ServerRoute = {
    method: 'POST',
    path: '/api/login',
    config: {
        tags: ['api', 'users'],
        description: 'Login',
        notes: 'Log user',
        handler: userController.doLogin,
        validate: {
            payload: createUserModel
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
        handler: userController.getUser,
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
        handler: userController.getUsers
    }
};

const postUser: Hapi.ServerRoute = {
    method: 'POST',
    path: '/api/users',
    config: {
        tags: ['api', 'users'],
        description: 'Create User',
        notes: 'Create a new User',
        handler: userController.createUser,
        validate: {
            payload: createUserModel
        },
        plugins: {
            'hapi-swagger': {
                responses: {
                    '201': {
                        description: 'User created.'
                    }
                }
            }
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
        handler: userController.updateUser,
        validate: {
            payload: createUserModel,
            headers: jwtValidator
        }
    }
};

const routes: Hapi.ServerRoute[] = [login, getUser, getUsers, postUser, updateUser];

export { routes as UserRoutes };
