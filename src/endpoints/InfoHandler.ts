import {HandlerBase} from "../models/HandlerBase";
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";
import {devicesModel} from "../database/models/device/devicesModel";
import {devicesDbModel} from "../database/models/device/devices";
import WebSocket = require("ws");
import {Model} from "mongoose";

class handler extends HandlerBase<any>{
    public handlerName = 'info';

    async handle(req: IncomingHandlerRequest<any>): Promise<any> {
        const details = req.details;

        switch (details.scope.toLowerCase()) {

            case "getall":
                const devices : Array<devicesModel> = await devicesDbModel.find({type: "securitySensor"});
                req.client.send(devices);

        }
    }
}

module.exports = handler;
