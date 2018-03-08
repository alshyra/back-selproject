'use-strict';

import * as hapi from 'hapi';
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

const server: hapi.Server = new hapi.Server();
server.connection({
    port: process.env.PORT || 3000,
    host: 'localhost'
});

// Routing
server.route(Routes);

server.route({
    method: 'GET',
    path: '/',
    handler: (request: hapi.Request, reply: hapi.Base_Reply) => {
        reply('Hello World !').code(200);
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
