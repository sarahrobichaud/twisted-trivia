import http from "node:http";
import { Server } from "socket.io";
import { SocketIONamespaceManager } from "./SocketIONameSpaceManager.js";

export class SocketIOServer {

    #server: Server | null = null;
    #namespaceManager: SocketIONamespaceManager;

    constructor(nsManager: SocketIONamespaceManager) {
        this.#namespaceManager = nsManager;
    }

    initialize(httpServer: http.Server): Server {
        this.#server = new Server(httpServer, {
            cors: {
                methods: ["GET", "POST"],
                origin: process.env.CLIENT_URL || "*",
            },
            path: "/trivia-app"
        });

        return this.#server;
    }

    getServer(): Server {
        if (!this.#server) {
            throw new Error("Socket IO server not initialized");
        }
        return this.#server;
    }

    get namespaceManager(): SocketIONamespaceManager {
        return this.#namespaceManager;
    }

}
