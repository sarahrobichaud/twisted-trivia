
import { Request, Response, NextFunction } from "express";
import { Application, RequestHandler, Router } from "express";

import { RouterConfig, AppMiddleware, RouteRegistration, ModuleContext, RouterEntry, ControllerHandlerRef, ControllerMethod, ControllerContext, HttpMethod } from "@bayfront/types/shared.js";
import { AppController } from "./Controller.js";
import { HttpException } from "../errors/HttpException.js";


export class AppRouter {

    #self: Router;
    #config: RouterConfig;
    #ctx: ModuleContext;
    #app: Application;


    #controllerInstances: Map<string, AppController> = new Map();

    #beforeMiddlewares: AppMiddleware[] = []
    #afterMiddlewares: AppMiddleware[] = []


    constructor(config: RouterConfig, context: ModuleContext) {
        this.#self = Router()
        this.#config = config
        this.#app = context.app
        this.#ctx = context
    }


    useBefore(middleware: RequestHandler, path = null) {
        this.#beforeMiddlewares.push({ path, middleware })
    }

    useAfter(middleware: RequestHandler, path = null) {
        this.#afterMiddlewares.push({ path, middleware })
    }

    _before() {
        this.#beforeMiddlewares.forEach(this.#applyMiddleware.bind(this))
    }

    _after() {
        this.#afterMiddlewares.forEach(this.#applyMiddleware.bind(this))
    }


    registerController<T extends AppController>(
        ControllerClass: new (context: ControllerContext) => T
    ): T {
        const controllerName = ControllerClass.name;

        const existing = this.#controllerInstances.get(controllerName);
        if (existing) {
            return existing as T;
        }

        const controller = new ControllerClass({ services: this.#ctx.container.services });
        this.#controllerInstances.set(controllerName, controller);
        return controller;
    }

    _register(registration: RouteRegistration) {
        const handlers = Array.isArray(registration.action)
            ? registration.action
            : [registration.action];

        try {
            const processedHandlers = handlers.map(handler => {
                if (this.isControllerHandlerRef(handler)) {
                    const ControllerClass = handler.controller;
                    const controller = this.registerController(ControllerClass);

                    const actionName = handler.action;

                    const method = (controller as any)[actionName];

                    if (typeof method !== 'function') {
                        throw new Error(`Method "${actionName}" not found on controller ${ControllerClass.name}`);
                    }

                    return this.executionWrapper(method.bind(controller)) as RequestHandler;
                }

                return this.executionWrapper(handler);
            });

            this.#self[registration.method](registration.path, ...processedHandlers);

        } catch (error) {
            console.error(error);
        }
    }

    private executionWrapper(handler: RequestHandler) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await handler(req, res, next);
            } catch (error) {
                console.error(error);
                if (error instanceof HttpException) {
                    next(error);
                } else {
                    next(HttpException.InternalServerError("An error occurred while processing the request"));
                }
            }
        }
    }


    protected handler<T extends AppController, K extends ControllerMethod<T>>(
        controller: new (...args: any[]) => T,
        action: K
    ): ControllerHandlerRef {
        return {
            controller,
            action: action as string
        };
    }

    private isControllerHandlerRef(handler: any): handler is ControllerHandlerRef {
        return handler &&
            typeof handler === 'object' &&
            'controller' in handler &&
            'action' in handler;
    }


    _registerRoutes() {
        const entry = this.setup();

        if (entry && entry.routes) {
            entry.routes.forEach(route => this._register(route));
        }
    }

    get #prefix() {
        if (this.#config.apiRoute) {
            return "/api" + this.#config.prefix;
        }

        return this.#config.prefix;
    }

    protected setup(): RouterEntry {
        throw new Error("You must override setup() and return a RouterEntry object");
    }

    init() {
        this._before()

        this._registerRoutes()

        this.#app.use(this.#prefix, this.#self)

        this._after()
    }

    #applyMiddleware({ path, middleware }: AppMiddleware) {
        if (path !== null) {
            this.#app.use(path, middleware)
        } else {
            console.log("Applying middleware to all paths", middleware)
            this.#app.use(middleware)
        }
    }
}