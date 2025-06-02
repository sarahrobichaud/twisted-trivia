import { Application, RequestHandler } from "express";

import { Server as SocketIOServer } from "socket.io";
import { HttpException } from "../errors/HttpException.js";
import { AppController } from "../http/Controller.js";

interface BaseContainer {
    services: Record<string, any>;
    [key: string]: Record<string, any>;
}

interface BaseServices {
    [key: string]: Record<string, any>;
}

export const HttpMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch"
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export type ControllerContext = {
    services: BayFront.Services;
}

export type ModuleContext = {
    app: Application;
    container: BayFront.ContainerType;
    io?: SocketIOServer;
}

export type AppModuleConfig = {
    setupViewEngine: boolean;
    viewPath: string;
    partialsPath: string;
    defaultMiddlewares: boolean;
    public: {
        serve: boolean;
        path: string;
    }
    responseFormatter?: Partial<ResponseFormatterOptions>;
}

export type RouterConfig = {
    prefix: string;
    apiRoute: boolean;
}

export type AppMiddleware = {
    path: string | null;
    middleware: RequestHandler;
}

export interface ResponseFormatterOptions {
    includeTimestamp?: boolean;
    includeStatus?: boolean;
    success?: SuccessResponseOptions;
    error?: FailureResponseOptions;

    successTransformer: ((data: any) => any) | null;
    failureTransformer: ((error: HttpException) => any) | null;
}

interface SuccessResponseOptions {
    statusField?: string;
    dataField?: string;
    messageField?: string;
}

interface FailureResponseOptions {
    statusField?: string;
    messageField?: string;
    detailsField?: string;
}


export type ControllerMethod<T> = {
    [K in keyof T]: T[K] extends (req: any, res: any, ...args: any[]) => any ? K : never
}[keyof T];

export interface ControllerHandlerFactory {
    <T extends AppController, K extends ControllerMethod<T>>(
        controller: new (...args: any[]) => T,
        action: K
    ): {
        controller: new (...args: any[]) => T;
        action: K;
    };
}

export type ControllerHandlerRef = {
    controller: new (...args: any[]) => AppController;
    action: string;
};

export type RouteRegistration = {
    path: string;
    method: HttpMethod;
    action: RequestHandler | RequestHandler[] |
    ControllerHandlerRef |
    Array<ControllerHandlerRef | RequestHandler>;
};


export type RouterEntry = {
    routes: RouteRegistration[];
};