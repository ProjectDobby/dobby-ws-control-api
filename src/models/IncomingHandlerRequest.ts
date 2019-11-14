import {DeviceType} from "../database/models/devicesModel";
import {Mongoose} from "mongoose";

export interface IncomingHandlerRequest<T> {
    deviceType: DeviceType,
    deviceId: string,
    timeStamp: Date,
    response: (msg: string) => void,
    client: WebSocket,
    details: T,
    database: Mongoose
}

