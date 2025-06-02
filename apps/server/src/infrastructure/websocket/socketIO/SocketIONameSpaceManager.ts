import { Server, Namespace } from "socket.io";
import { SocketIOGameCommandHandler } from "./SocketIOGameCommandHandler.js";
import { SocketIOConnectionHandler } from "./SocketIOConnectionHandler.js";

export class SocketIONamespaceManager {
    #connectionHandler: SocketIOConnectionHandler;

    static readonly GAME_NAMESPACE = "/socket/game";

    constructor(
        connectionHandler: SocketIOConnectionHandler,
    ) {
        this.#connectionHandler = connectionHandler;
    }

    getGameNamespace(io: Server): Namespace {
        return io.of(SocketIONamespaceManager.GAME_NAMESPACE)
    }

    configureNamespaces(io: Server): { game: Namespace } {
        const gameNamespace = io.of(SocketIONamespaceManager.GAME_NAMESPACE);
        this.configureGameNamespace(gameNamespace);
        return { game: gameNamespace };
    }

    private configureGameNamespace(namespace: Namespace): void {
        namespace.use(this.#connectionHandler.authenticateGameConnection.bind(this.#connectionHandler));

        namespace.on("connection", (socket) => {
            this.#connectionHandler.handleConnection(socket);
        });
    }
}