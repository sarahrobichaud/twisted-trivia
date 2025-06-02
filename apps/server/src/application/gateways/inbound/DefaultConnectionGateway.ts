import { ConnectionGateway } from "./ConnectionGateway.js";
import { ConnectionIdentifier } from "~/domain/contracts/ConnectionIdentifier.js";
import { GameRole } from "~/domain/roles/GameRoles.js";
import { GameConnectionService } from "~/domain/contracts/services/GameConnectionService.js";

export class DefaultConnectionGateway implements ConnectionGateway {
    #gameConnectionService: GameConnectionService;
    #connections: Map<string, { gameId: string, playerId: string, groups: { name: string, roles: GameRole[] }[] }> = new Map();

    constructor(gameConnectionService: GameConnectionService) {
        this.#gameConnectionService = gameConnectionService;
    }

    async authenticate(authData: Record<string, any>): Promise<ConnectionIdentifier | null> {

        const { gameId, code, } = authData;

        const player = await this.#gameConnectionService.authenticate(gameId, code);

        if (!player) {
            throw new Error("Invalid access token");
        }

        const isJoinable = await this.#gameConnectionService.isGameJoinable(gameId, player.id);

        if (!isJoinable) {
            throw new Error("Game is not joinable");
        }

        return {
            id: player.id,
            metadata: {
                playerId: player.id,
                roles: player.roles,
                gameId,
            }
        };
    }
    async registerConnection(connectionId: string, gameId: string, playerId: string): Promise<void> {
        this.#connections.set(connectionId, { gameId, playerId, groups: [] });

        // Update player status in domain
        await this.#gameConnectionService.connect(connectionId, gameId, playerId);
    }

    async unregisterConnection(connectionId: string): Promise<void> {
        const connection = this.#connections.get(connectionId);

        if (connection) {
            const { gameId, playerId } = connection;

            // Update player status in domain
            await this.#gameConnectionService.disconnect(gameId, playerId);

            this.#connections.delete(connectionId);
        }
    }

    async addConnectionToGroup(connectionId: string, group: { name: string, roles: GameRole[] }): Promise<void> {
        const connection = this.#connections.get(connectionId);

        if (connection) {
            connection.groups.push(group);
        }
    }

    async removeConnectionFromGroup(connectionId: string, groupName: string): Promise<void> {
        const connection = this.#connections.get(connectionId);

        if (connection) {
            connection.groups = connection.groups.filter(group => group.name !== groupName);
        }
    }
    async clearConnectionFromAllGroups(connectionId: string): Promise<void> {
        const connection = this.#connections.get(connectionId);

        if (connection) {
            connection.groups = [];
        }
    }
}