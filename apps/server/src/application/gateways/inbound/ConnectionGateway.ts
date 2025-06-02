import { ConnectionIdentifier } from "~/domain/contracts/ConnectionIdentifier.js";
import { GameRole } from "~/domain/roles/GameRoles.js";

export interface ConnectionGateway {
    authenticate(authData: Record<string, any>): Promise<ConnectionIdentifier | null>;
    registerConnection(connectionId: string, gameId: string, playerId: string): Promise<void>;
    unregisterConnection(connectionId: string): Promise<void>;

    addConnectionToGroup(connectionId: string, group: { name: string, roles: GameRole[] }): Promise<void>;
    removeConnectionFromGroup(connectionId: string, groupName: string): Promise<void>;
    clearConnectionFromAllGroups(connectionId: string): Promise<void>;
}