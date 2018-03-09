'use-strict';

import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as HapiSwagger from 'hapi-swagger';
import * as Vision from 'vision';
import * as Mongoose from 'mongoose';
import * as Path from 'path';
import { Routes } from './index.routes';
const packageJSON = require('../package.json');

Mongoose.connect('mongodb://localhost/selproject')
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

// Routing
server.route(Routes);

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
        } /*,
        {
            plugin: require('hapi-pino'),
            options: pinoOptions
        }*/
    ]);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            return reply.file('./public/hello.html');
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
