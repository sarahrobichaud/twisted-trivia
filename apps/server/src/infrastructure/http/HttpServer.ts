import http, { Server } from "node:http";
import { Application } from "express";

export class AppHttpServer {
    #server: Server;

    constructor(expressApp: Application | null = null) {
        this.#server = expressApp ? http.createServer(expressApp) : http.createServer();
    }

    get server() {
        return this.#server;
    }

    listen() {
        this.#server.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    }
}
