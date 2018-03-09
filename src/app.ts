'use-strict';

import * as Hapi from 'hapi';
import * as Inert from 'inert';
import * as HapiSwagger from 'hapi-swagger';
import * as Vision from 'vision';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { Routes } from './index.routes';
const packageJSON = require('../package.json');

mongoose.connect('mongodb://localhost/echosforex');

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error while opening db');
});

db.once('open', () => {
    console.log('Db open');
});

const server = new Hapi.Server({
    port: process.env.PORT || 3000,
    host: 'localhost'
});

// Routing
server.route(Routes);

server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
        return 'hello world';
    }
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
            plugin: require('hapi-pino'),
            options: pinoOptions
        }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
