import {Mongoose} from "mongoose";
import WebSocket = require("ws");

export interface IncomingHandlerRequest<T> {
    deviceMac: string;
    deviceType: string,
    deviceId?: string,
    timeStamp: Date,
    response: (msg: string) => void,
    client: WebSocket,
    details: T,
    database: Mongoose
}
