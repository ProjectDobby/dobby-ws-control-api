import {HandlerBase} from '../models/HandlerBase';
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";
import {devicesModel} from "../database/models/device/devicesModel";
import {devicesDbModel} from "../database/models/device/devices";
import {RFIDSensorDeviceRequestModel} from "../models/RFIDSensorDeviceRequestModel";
import WebSocket = require("ws");
import {RFIDCardsModel} from "../database/models/RFIDCard/RFIDCardsModel";
import {RFIDCardsDbModel} from "../database/models/RFIDCard/RFIDCards";

class handler extends HandlerBase<any> {
    public handlerName = 'rfid';
    private listeners: Array<WebSocket> = [];
    private handlers: Map<WebSocket, devicesModel> = new Map<WebSocket, devicesModel>();

    async handle(req: IncomingHandlerRequest<RFIDSensorDeviceRequestModel>): Promise<any> {
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
                const card: RFIDCardsModel | null = await RFIDCardsDbModel.findOne({cardstring: details.RFIDstring});
                if (card) {
                    await devicesDbModel.update({type: "securitySensor"}, {activated: true});
                    return {status: "activated"};
                } else return {status: "failed", message: "Card is not registered"};

            case "authorize":
                await devicesDbModel.findOneAndUpdate({mac: req.deviceMac}, {authorized: true});
                return {status: "SUCCESS", msg: "Succesfull authorized"};

        }
    }

}

module.exports = handler;
