import { Request, Response, NextFunction } from "express";
import { Http_Exception } from "../errors/HttpException.ts";
import { BaseContainer, BaseServices } from "@bayfront/types/shared.js";

declare global {
    namespace Express {
        interface Response {
            success: (body: any, message?: string) => Response;
            failure: (error: Http_Exception) => Response;
        }
    }

    namespace BayFront {
        interface ContainerType extends BaseContainer {
            services: Services;
        }

        interface Services extends BaseServices { }
    }
}

