import mongoose from 'mongoose';

const config = require('../config.json');

export const getConnection = () => {
    console.log('Connecting to mongodb://*HIDDEN*:*HIDDEN*@%s:%s/%s');
    mongoose.connect('mongodb://%s:%s@%s:%s/%s',);
};
