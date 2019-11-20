import {Document} from "mongoose";

export enum DeviceType{
    DOOR_SENSOR,
    WINDOW_SENSOR,
}

export interface devicesModel extends Document {
    mac: string,
    name: string,
    token: string,
    activated : boolean,
    settings?: any
    type: DeviceType
}
