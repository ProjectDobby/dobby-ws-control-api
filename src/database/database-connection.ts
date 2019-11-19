import mongoose from 'mongoose';

const config = require('../../config.json').database;

export const getConnection = () => {
    console.log('Connecting to mongodb://*HIDDEN*:*HIDDEN*@%s:%s/%s', config.host, config.port, config.database);
    const connection = "mongodb://" + config.username + ":" + config.password + "@" + config.database + ":" + config.port + "/" + config.database;
    mongoose.connect(connection);
};
