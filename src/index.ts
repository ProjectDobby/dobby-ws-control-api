import * as fs from 'fs';
import * as Websocket from 'ws';
import {HandlerBase} from "./models/HandlerBase";
import {getConnection} from "./database/database-connection";

// Establish database connection
getConnection();

// Parse program arguments
const hasArg = (arg: string): boolean => process.argv.slice(2).includes(arg);
const debug = hasArg("-debug");

// Create directories if necessary
if (!fs.existsSync('./lib/endpoints/'))
    fs.mkdirSync('./lib/endpoints/');

// Hold available handlers
const handlers: Array<HandlerBase<any>> = [];

// Fill handler-holder with available endpoints
fs.readdirSync('./lib/endpoints/').forEach((val: string) => {
    try {
        const importedHandlerClass = require('./endpoints/' + val);
        const handler: HandlerBase<any> = new importedHandlerClass();
        console.log('New handler found: %s (%s)', handler.handlerName, val);
        handlers.push(handler);
    } catch (e) {
        console.log('Invalid handler found: %s', val);
    }
});

// Create websocket server and inform user in console
const wss = new Websocket.Server({port: 8080}, () => console.log('Server running'));

//Wait for client connections
wss.on('connection', ws => {

    // Query device or user by token
    // TODO implement security token

    // Handle request
    ws.on('message', (msg: string) => {
        const date = new Date();
        if (debug) {
            console.log('%s: %s', date.toLocaleString(), msg);
        }

    });
});
