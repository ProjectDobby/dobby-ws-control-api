import { Schema, Document } from "mongoose";

export enum DeviceType{
    DOOR_SENSOR,
    WINDOW_SENSOR,
}

export interface devicesModel extends Document {
    name: string,
    token: string,
    settings?: any
    type: DeviceType
}