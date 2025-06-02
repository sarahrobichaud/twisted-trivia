import { HttpException } from "../errors/HttpException.js";
import { ModuleContext, ResponseFormatterOptions } from "../types/shared.js";
import { Response, Request, NextFunction } from "express";


const defaultOptions = {
    includeStatus: true,
    includeTimestamp: true,
    success: {
        statusField: "status",
        dataField: "data",
        messageField: "message",
    },
    error: {
        statusField: "status",
        messageField: "message",
        detailsField: "details",
    },
    successTransformer: null,
    failureTransformer: null,
} satisfies ResponseFormatterOptions;


export function createResponseFormatter(options: Partial<ResponseFormatterOptions> = {}) {

    const config = { ...defaultOptions, ...options } as ResponseFormatterOptions;

    return (ctx: ModuleContext) => {
        return (req: Request, res: Response, next: NextFunction) => {

            // Success response formatter
            res.success = (data: any, message?: string): Response => {

                const successConfig = config.success!;

                const response: Record<string, any> = {
                    success: true,
                    [successConfig.dataField!]: data,
                };

                if (message) {
                    response[successConfig.messageField!] = message;
                }

                if (config.includeStatus) {
                    response[successConfig.statusField!] = res.statusCode;
                }

                if (config.includeTimestamp) {
                    response.timestamp = new Date().toISOString();
                }

                const finalResponse = !!config.successTransformer
                    ? config.successTransformer(data)
                    : response;


                return res.json(finalResponse);
            };

            // Error response formatter
            res.failure = (error: HttpException): Response => {

                const errorConfig = config.error!;

                const response: Record<string, any> = {
                    success: false,
                    [errorConfig.messageField!]: error.message,
                    [errorConfig.detailsField!]: error.details,
                };

                if (config.includeStatus) {
                    response[errorConfig.statusField!] = error.statusCode;
                }

                if (config.includeTimestamp) {
                    response.timestamp = new Date().toISOString();
                }

                const finalResponse = !!config.failureTransformer
                    ? config.failureTransformer(error)
                    : response;

                return res.json(finalResponse);
            };

            next();
        };
    };
}

export function createErrorHandler() {
    return (ctx: ModuleContext) => {
        return (err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error(err);

            if (err instanceof HttpException) {
                res.status(err.statusCode).failure(err);
                return;
            }

            res.status(500).failure(new HttpException("Unexpected error", 500));
        };
    };
}
