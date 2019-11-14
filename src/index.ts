import * as fs from 'fs';
import * as Websocket from 'ws';
import {HandlerBase} from "./models/HandlerBase";

const hasArg = (arg: string): boolean => process.argv.slice(2).includes(arg);
const debug = hasArg("-debug");

if (!fs.existsSync('./lib/endpoints/'))
    fs.mkdirSync('./lib/endpoints/');

const handlers: Array<HandlerBase<any>> = [];

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

const wss = new Websocket.Server({port: 8080}, () => console.log('Server running'));

wss.on('connection', ws => {

    // TODO implement security token

    ws.on('message', (msg: string) => {
        const date = new Date();
        if (debug) {
            console.log('%s: %s', date.toLocaleString(), msg);
        }

    });
});
