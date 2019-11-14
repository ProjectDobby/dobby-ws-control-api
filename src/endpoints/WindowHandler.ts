import {HandlerBase} from "../models/HandlerBase";
import {IncomingHandlerRequest} from "../models/IncomingHandlerRequest";

class handler extends HandlerBase<any> {
    public handlerName = 'window';

    handle(req: IncomingHandlerRequest<any>): any {
    }

}

module.exports = handler;
