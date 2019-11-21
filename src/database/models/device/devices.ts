import mongoose, { Schema } from 'mongoose';
import {devicesModel} from './devicesModel';

export const devicesSchema = new Schema<devicesModel>({
    mac: {type: String, required:true},
    name: {type: String, required:true},
    token: {type: String, required:true},
    type: {type: String, required:true},
    activated: {type: Boolean, required:true},
    authorized: {type: Boolean, required:true},
    settings: {type: Object, default: {}}
});

export const devicesDbModel = mongoose.model<devicesModel>('devices', devicesSchema);
