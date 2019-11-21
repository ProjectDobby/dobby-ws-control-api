import {HandlerBase} from '../models/HandlerBase';
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";
import {devicesModel} from "../database/models/device/devicesModel";
import {devicesDbModel} from "../database/models/device/devices";
import {KeypadDeviceRequestModel} from "../models/KeypadDeviceRequestModel";
import WebSocket = require("ws");
import {model} from "mongoose";

class handler extends HandlerBase<any> {
    public handlerName = 'pinpad';
    private listeners: Array<WebSocket> = [];
    private handlers: Map<WebSocket, devicesModel> = new Map<WebSocket, devicesModel>();

    async handle(req: IncomingHandlerRequest<KeypadDeviceRequestModel>): Promise<any> {
        const details = req.details;
        switch (details.scope.toLowerCase()) {

            // Websocket wants to tell API that the device is available and ready
            case "register":
                if (!this.handlers.has(req.client)) {
                    // Load device from database
                    const device: devicesModel = await devicesDbModel.findOne({mac: req.deviceMac}) as devicesModel;

                    if (!device) {
                        // This little snitch of a device is not in the database
                        const model: devicesModel = details.specificDetails;
                        model.authorized = false;
                        await devicesDbModel.create(model);
                    }
                    // Save handler
                    this.handlers.set(req.client, device);
                    return {status: "OK"};
                } else return {status: "WARNING", message: "Already registered."};

            case "activate":
                if(details.enteredPin === 1234) {
                    await devicesDbModel.update({type: "securitySensor"}, {activated: true});
                    return {status: "activated"};
                } else return {status: "ERROR", msg: "Wrong Pin"};

            case "authorize":
                await devicesDbModel.findOneAndUpdate({mac: req.deviceMac}, {authorized: true});
                return {status: "SUCCESS", msg: "Succesfull authorized"};

        }
    }

}

module.exports = handler;
