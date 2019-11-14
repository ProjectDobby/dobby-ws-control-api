import {IncomingHandlerRequest} from "./IncomingHandlerRequest";

export abstract class HandlerBase<T> {
    public abstract handlerName: string;
    public abstract handle(req: IncomingHandlerRequest<T>): any;
}
