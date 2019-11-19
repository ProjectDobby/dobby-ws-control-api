import * as fs from 'fs';
import * as Websocket from 'ws';
import {HandlerBase} from "./models/HandlerBase";
import {getConnection} from "./database/database-connection";
import {IncomingHandlerRequest} from "./models/IncomingHandlerRequest";
import * as mongoose from "mongoose";

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
    ws.on('message', (msg: string, listener: Websocket) => {
        const date = new Date();
        if (debug) {
            console.log('%s: %s', date.toLocaleString(), msg);
        }
        let ob: any;
        try {
            ob = JSON.parse(msg);
        } catch (e) {
            listener.send(JSON.stringify({status: "INVALID-JSON-ERROR"}));
            if (debug) console.log("Invalid JSON. Aborting.");
            return;
        }
        let req: IncomingHandlerRequest<any>;
        try {
            req = {
                client: listener,
                database: mongoose,
                details: ob.details,
                deviceId: ob.deviceId,
                deviceType: ob.deviceType,
                response: function (p1: string) {
                    listener.send(p1);
                },
                timeStamp: date
            };
        } catch (e) {
            listener.send(JSON.stringify({status: "INVALID-REQUEST-ERROR"}));
            if (debug) console.log("Invalid Request. Aborting.");
            return;
        }
        let handled: boolean = false;
        for (let h of handlers.filter(h => h.handlerName === ob.handler)) {
            try {
                const ob = h.handle(req);
                listener.send(JSON.stringify(ob));
                handled = true;
            } catch (e) {
                listener.send(JSON.stringify({status: "HANDLE-ERROR"}));
                if (debug) console.log("Exception while handling: %s. Aborting.", e);
                return;
            }
        }
        if (handled && debug) console.log("Request was handled successfully.");
        else if (debug) console.log("Error while handling or no handlers available for that type of request (%s).", ob.handler);
    });
});
