import {HandlerBase} from "../models/HandlerBase";
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";
import {devicesModel} from "../database/models/device/devicesModel";
import {devicesDbModel} from "../database/models/device/devices";
import {TemperatureDeviceRequestModel} from "../models/TemperatureDeviceRequestModel";

class handler extends HandlerBase<any> {
    public handlerName = 'Temperature';
    public listeners: Array<WebSocket> = [];
    public handlers: Map<WebSocket, devicesModel> = new Map<WebSocket, devicesModel>();

    async handle(req: IncomingHandlerRequest<TemperatureDeviceRequestModel>): Promise<any> {
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
                } else return {status: "WARNING", message: "Already listening."}

            // Websocket wants to tell API that the device is available and ready
            case "register":
                if (!this.handlers.has(req.client)) {
                    // Load device from database
                    const device: devicesModel | null = await devicesDbModel.findById(req.deviceId);

                    if (!device) {
                        // This little snitch of a device is not in the database
                        return {status: "ERROR", message: "I donno man, seems kinda unknown to me"};
                    }
                    // Save handler
                    this.handlers.set(req.client, device);
                    return {status: "OK"};
                } else return {status: "WARNING", message: "Already registered."};

            // Inform listeners that an event happened
            case "inform":
                if (this.handlers.has(req.client)) {
                    this.listeners.forEach(l => {
                        l.send(JSON.stringify({
                            scope: this.handlerName,
                            type: "inform",
                            temperature: details.temperature,
                            device: this.handlers.get(req.client)
                        }));
                    });
                } else return {status: "ERROR", message: "You cannot do that without being registered."};

            case "deactivate":
                this.handlers.forEach((dev, ws) => {
                    if (dev._id === details.deviceId) {
                        ws.send(JSON.stringify({type: "deactivate"}));
                        return {status: "deactivate SUCCESS"};
                    }
                });
                return {status: "deactivate FAILED"};

            case "activate":
                this.handlers.forEach((dev, ws) => {
                    if (dev.id === details.deviceId) {
                        ws.send(JSON.stringify({type: "activate"}));
                        return {status: "activate SUCCESS"};
                    }
                });
                return {status: "activate FAILED"};

        }
    }

}

module.exports = handler;
