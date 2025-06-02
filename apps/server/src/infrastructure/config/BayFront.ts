import { AppModuleConfig } from "@bayfront/types/shared.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

const publicPath = path.resolve(__dirname, "..", "public");
const viewsPath = path.resolve(__dirname, "presentation", "views");
const partialsPath = path.resolve(__dirname, "presentation", "views", "partials");

export const bayfrontConfig = {
    setupViewEngine: true,
    viewPath: viewsPath,
    partialsPath: partialsPath,
    defaultMiddlewares: true,
    public: {
        serve: true,
        path: publicPath,
    },
    responseFormatter: {
        includeTimestamp: true,
        includeStatus: true,
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
    }
} satisfies Partial<AppModuleConfig>;
