'use-strict';

import * as Hapi from 'hapi';
import * as mongoose from 'mongoose';
import * as path from 'path';
import { Routes } from './index.routes';

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
    await server.register({
        plugin: require('hapi-pino'),
        options: {
            prettyPrint: true,
            logEvents: ['response']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();
