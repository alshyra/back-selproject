'use-strict';

import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as HapiSwagger from 'hapi-swagger';
import * as Vision from 'vision';
import * as Mongoose from 'mongoose';
import * as Path from 'path';
import { Routes } from './index.routes';
import { secretKey } from './user/user.utils';
import { userModel, IUser } from './user/user.model';
import { IRequest } from './interfaces/request';
import { UserController } from './user/user.controller';
const packageJSON = require('../package.json');

Mongoose.connect('mongodb://localhost:27017/selproject')
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.log('err:', err);
    });

const db = Mongoose.connection;

const server = new Hapi.Server({
    port: process.env.PORT || 3000,
    host: 'localhost'
});

const init = async () => {
    const swaggerOptions = {
        info: {
            title: 'Sel Documentation',
            description: 'Sel Api Documentation',
            version: packageJSON.version
        },
        tags: [
            {
                name: 'users',
                description: 'Api users interface.'
            }
        ],
        documentationPath: '/docs'
    };
    const pinoOptions = {
        logEvents: ['response'],
        prettyPrint: true
    };

    const jwtOptions = {
        info: {
            name: 'JWT Authentication',
            version: '1.0.0'
        }
    };

    await server.register([
        {
            plugin: require('inert')
        },
        {
            plugin: require('vision')
        },
        {
            plugin: require('hapi-swagger'),
            options: swaggerOptions
        },
        {
            plugin: require('hapi-auth-jwt2'),
            options: jwtOptions
        } /*,
        {
            plugin: require('hapi-pino'),
            options: pinoOptions
        }*/
    ]);
    const validate = async (decoded: any, request: IRequest, h: Hapi.ResponseToolkit) => {
        try {
            const user = JSON.parse(JSON.stringify(decoded));
            const userFromDataBase: IUser = await userModel.findById(user._id).exec();
            if (!userFromDataBase) {
                return { isValid: false };
            }
            return { isValid: true };
        } catch (err) {
            return { isValid: false };
        }
    };

    server.auth.strategy('jwt', 'jwt', {
        key: secretKey,
        validate,
        verifyOptions: { algorithms: ['HS256'] }
    });

    server.auth.default('jwt');

    // Routing
    server.route(Routes);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply
                .response('Please wait while we send your elsewhere')
                .redirect('/docs');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
