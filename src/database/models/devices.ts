import mongoose, { Schema } from 'mongoose';
import {devicesModel} from './devicesModel';

export const devicesSchema = new Schema<devicesModel>({
    id: { type: String, required: true, unique: true},
    name: {type: String, required:true},
    token: {type: String, required:true},
    settings: {type: Object, default: {}}
});

export const devicesDbModel = mongoose.model('devices', devicesSchema);