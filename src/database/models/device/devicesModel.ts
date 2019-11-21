import {Document} from "mongoose";

export interface devicesModel extends Document {
    mac: string,
    name: string,
    token: string,
    activated : boolean,
    settings?: any
    type: string
}
