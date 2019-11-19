import {DeviceType} from "../database/models/device/devicesModel";
import {Mongoose} from "mongoose";
import WebSocket = require("ws");

export interface IncomingHandlerRequest<T> {
    deviceMac: string;
    deviceType: DeviceType,
    deviceId?: string,
    timeStamp: Date,
    response: (msg: string) => void,
    client: WebSocket,
    details: T,
    database: Mongoose
}
