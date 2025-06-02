import { Namespace } from "socket.io";
import { GameEvent } from "~/domain/events/GameEvents.js";
import { GameRole } from "~/domain/roles/GameRoles.js";

export interface GameEventPublisher {
    setupNamespace(namespace: Namespace): void;
    publishToGame(gameId: string, event: GameEvent): void;
    publishToRole(gameId: string, role: GameRole, event: GameEvent): void;
    publishToPlayer(gameId: string, playerId: string, event: GameEvent): void;
}