import mongoose, { Schema } from 'mongoose';
import {devicesModel} from './devicesModel';

export const devicesSchema = new Schema<devicesModel>({
    name: {type: String, required:true},
    token: {type: String, required:true},
    type: {type: String, required:true},
    settings: {type: Object, default: {}}
});

export const devicesDbModel = mongoose.model<devicesModel>('devices', devicesSchema);
