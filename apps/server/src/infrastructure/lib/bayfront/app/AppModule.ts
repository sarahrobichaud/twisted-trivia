
import express, { ErrorRequestHandler, NextFunction, RequestHandler, Response, Request } from "express";
import hbs from "hbs";
import fs from "node:fs";

import { AppRouter } from "../http/Router.js";
import { AppModuleConfig, ModuleContext, RouterConfig, ResponseFormatterOptions, HttpMethod } from "../types/shared.js";
import { createResponseFormatter } from "../middleware/core.middleware.js";
import { createErrorHandler } from "../middleware/core.middleware.js";
import path from "node:path";
import { HttpException } from "../errors/HttpException.js";

/**
 * @abstract
 */
export class AppModule {

    #context: ModuleContext;
    #routers: AppRouter[] = [];
    #config: AppModuleConfig;

    #errorHandlers: ErrorRequestHandler[] = [];
    #responseFormatterApplied: boolean = false;

    constructor(container: BayFront.ContainerType, config: AppModuleConfig) {
        this.#context = {
            app: express(),
            container: container
        };

        this.#config = config;
    }

    get app() {
        return this.#context.app;
    }

    useResponseFormatter(options: Partial<ResponseFormatterOptions> = {}) {
        const formatter = createResponseFormatter(options as ResponseFormatterOptions);

        this.app.use(formatter(this.#context));
        this.#responseFormatterApplied = true;
        return this;
    }

    use(middleware: RequestHandler) {
        this.app.use(middleware);
        return this;
    }

    useDefaultErrorHandler() {
        const errorHandler = createErrorHandler();
        this.#errorHandlers.push(errorHandler(this.#context));
        return this;
    }

    applyErrorHandlers() {
        for (const handler of this.#errorHandlers) {
            this.app.use(handler);
        }
    }

    registerRouter(config: RouterConfig, router: new (...args: any[]) => AppRouter) {
        const instance = new router(config, this.#context);
        this.#routers.push(instance);
    }

    init() {
        console.log("Initializing module", this.constructor.name);

        if (!this.#responseFormatterApplied) {
            console.log("Applying default response formatter");
            this.useResponseFormatter();
        }

        if (this.#config.defaultMiddlewares) {
            this.#registerDefaultMiddlewares();
        }

        if (this.#config.setupViewEngine) {
            console.log("Setting up view engine");
            this.#setupViewEngine();
        }

        for (const router of this.#routers) {
            console.log("Initializing router", router.constructor.name);
            router.init();
        }

        this.app.use((req, res, next) => {
            next(HttpException.NotFound("Route not found"));
        });

        if (this.#errorHandlers.length > 0) {
            this.applyErrorHandlers();
        }
    }

    #registerDefaultMiddlewares() {
        this.app.use(express.json());

        if (this.#config.public.serve) {
            this.app.use(express.static(this.#config.public.path));
        }
    }

    #setupViewEngine() {
        const viewsDir = this.#config.viewPath;
        const partialsDir = this.#config.partialsPath;

        // Set up Handlebars as the view engine first
        this.#context.app.set("view engine", "hbs");
        this.#context.app.set("views", viewsDir);

        // Set the default layout for all views
        this.#context.app.set("view options", {
            layout: "layouts/main"
        });

        console.log("Views directory:", viewsDir);
        console.log("Partials directory:", partialsDir);

        hbs.registerPartials(partialsDir);

        // Watch for changes in partials directory during development
        // Debounce cause fs.watch is wonky
        if (process.env.NODE_ENV === 'development') {
            fs.watch(partialsDir, this.#debounce((eventType: string, filename: string) => {
                if (eventType === 'change') {
                    console.log(`Partial ${filename} changed, reloading...`);
                    hbs.registerPartials(partialsDir, () => {
                        console.log("Partials reloaded successfully");
                    });
                }
            }, 500));
        }
    }

    #debounce(func: (...args: any[]) => void, wait: number) {
        let timeout: NodeJS.Timeout;
        return function executedFunction(...args: any[]) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}