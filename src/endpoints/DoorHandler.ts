import {HandlerBase} from '../models/HandlerBase';
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";
import {devicesModel} from "../database/models/device/devicesModel";
import {devicesDbModel} from "../database/models/device/devices";
import WebSocket = require("ws");
import {Model} from "mongoose";

class handler extends HandlerBase<devicesModel> {
    public handlerName = 'door';
    private listeners: Array<WebSocket> = [];
    private handlers: Map<WebSocket, devicesModel> = new Map<WebSocket, devicesModel>();

    async handle(req: IncomingHandlerRequest<any>): Promise<any> {
        const details = req.details;
        switch (details.scope.toLowerCase()) {

            // Websocket wants to be informed about new incoming events from windows
            case "listen":
                // Check if it's already listening
                if (!this.listeners.includes(req.client)) {
                    // Add it to listeners since it's not listening
                    this.listeners.push(req.client);
                    return {status: "OK"};
                    // This websocket already is listening (kek)
                } else return {status: "WARNING", message: "Already listening."};

            // Websocket wants to tell API that the device is available and ready
            case "register":
                if (!this.handlers.has(req.client)) {
                    // Load device from database
                    const device: devicesModel | null = await devicesDbModel.findOne({mac: req.deviceMac});

                    if (!device) {
                        // This little snitch of a device is not in the database
                        const model: devicesModel = details.specificDetails;
                        await devicesDbModel.create(model);
                        return {status: "ERROR", message: "I donno man, seems kinda unknown to me"};
                    }
                    // Save handler
                    this.handlers.set(req.client, device);
                    return {status: "OK"};
                } else return {status: "WARNING", message: "Already registered."};

            // Inform listeners that an event happened
            case "inform":
                if (this.handlers.has(req.client))  {
                    const device : devicesModel = await devicesDbModel.findOne({mac: req.deviceMac}) as devicesModel;
                    if (device.activated){
                        this.listeners.forEach(l => {
                            l.send(JSON.stringify({
                                scope: this.handlerName,
                                type: "inform",
                                device: this.handlers.get(req.client)
                            }));
                        });
                        return {status: "SUCCESS", message: "Successfull informed"};
                    }
                    else return {status: "ERROR", message: "Device is deactivated"};
                } else return {status: "ERROR", message: "You cannot do that without being registered."};

            case "deactivate":
                const modeldeactivate : devicesModel = details.specificDetails;
                await devicesDbModel.findOneAndUpdate({id: modeldeactivate._id}, modeldeactivate);
                return {status: "deactivated"};

            case "activate":
                const modelactivate: devicesModel = details.specificDetails;
                await devicesDbModel.findOneAndUpdate({id: modelactivate._id}, modelactivate);
                return {status: "activated"};

        }
    }

}

module.exports = handler;
