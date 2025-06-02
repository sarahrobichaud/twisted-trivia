import { ConnectionGateway } from "~/application/gateways/inbound/ConnectionGateway.js";
import { SocketIOGameCommandHandler } from "./SocketIOGameCommandHandler.js";
import { Socket } from "socket.io";
import { GameRole } from "~/domain/roles/GameRoles.js";

export class SocketIOConnectionHandler {

    #connectionGateway: ConnectionGateway;
    #gameCommandHandler: SocketIOGameCommandHandler

    constructor(connectionGateway: ConnectionGateway, gameCommandHandler: SocketIOGameCommandHandler) {
        this.#connectionGateway = connectionGateway;
        this.#gameCommandHandler = gameCommandHandler;
    }

    async authenticateGameConnection(socket: Socket, next: (err?: Error) => void): Promise<void> {
        try {
            const { gameId, code } = socket.handshake.auth;

            if (!gameId || !code) {
                throw next(new Error("Missing authentication credentials"));
            }

            const connection = await this.#connectionGateway.authenticate({
                gameId,
                code,
            });

            if (!connection) {
                throw next(new Error("Invalid credentials"));
            }

            socket.data.gameId = gameId;
            socket.data.playerId = connection.metadata.playerId;
            socket.data.roles = connection.metadata.roles;

            next();

        } catch (err) {
            console.error("Error authenticating socket", err);
            next(err instanceof Error ? err : new Error("Unknown error"));
        }
    }

    async handleConnection(socket: Socket): Promise<void> {

        const { gameId, playerId, roles } = socket.data;

        console.log(`Player ${playerId} connected to game ${gameId} with roles ${roles}`);

        await this.joinRooms(socket); // This needs to be done after the connection is registered else the player will not be in the room
        await this.#connectionGateway.registerConnection(socket.id, gameId, playerId);

        this.#gameCommandHandler.initializeListeners(socket);

        socket.on("disconnect", async () => {
            console.log(`Player ${playerId} disconnected from game ${gameId}`);
            await this.#connectionGateway.unregisterConnection(socket.id);
            await this.#connectionGateway.clearConnectionFromAllGroups(socket.id);
        });
    }

    private async joinRooms(socket: Socket) {

        const { gameId, roles } = socket.data;

        const groupName = SocketIOConnectionHandler.getGroupName(gameId);
        socket.join(groupName);

        await this.#connectionGateway.addConnectionToGroup(socket.id, { name: groupName, roles });

        for (const role of roles) {
            const roomName = SocketIOConnectionHandler.getGroupName(gameId, role);
            socket.join(roomName);

            await this.#connectionGateway.addConnectionToGroup(socket.id, { name: roomName, roles: [role] });
        }
    }

    public static getGroupName(gameId: string, role?: GameRole): string {
        if (role) {
            return `game:${gameId}:role:${role}`;
        }
        return `game:${gameId}`;
    }
}
