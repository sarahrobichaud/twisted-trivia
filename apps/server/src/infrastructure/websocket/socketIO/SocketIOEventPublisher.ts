import { Namespace, Server } from "socket.io";
import { GameEventPublisher } from "~/application/gateways/outbound/GameEventPublisher.js";
import { GameEvent, HostLeft, Serializable } from "~/domain/events/GameEvents.js";
import { GameRole } from "~/domain/roles/GameRoles.js";
import { SocketIOConnectionHandler } from "./SocketIOConnectionHandler.js";
export class SocketIOEventPublisher implements GameEventPublisher {

    #namespace: Namespace | null = null;

    setupNamespace(namespace: Namespace): void {
        this.#namespace = namespace;
    }

    publishToGame(gameId: string, event: GameEvent): void {

        if (!this.#namespace) {
            console.warn("Namespace not initialized");
            return;
        }
        
        const groupName = SocketIOConnectionHandler.getGroupName(gameId);

        if(event instanceof HostLeft){
            this.#namespace?.to(groupName).disconnectSockets()
        }


        console.log("Publishing to game", gameId, event.type);

        this.#namespace?.to(groupName).emit(event.type, this.#transformPayload(event));
    }

    publishToRole(gameId: string, role: GameRole, event: GameEvent): void {

        if (!this.#namespace) {
            console.warn("Namespace not initialized");
            return;
        }

        console.log("Publishing to role", gameId, role, event.type);

        const roomName = SocketIOConnectionHandler.getGroupName(gameId, role);

        this.#namespace?.to(roomName).emit(event.type, this.#transformPayload(event));
    }

    publishToPlayer(gameId: string, playerId: string, event: GameEvent): void {

        if (!this.#namespace) {
            console.warn("Namespace not initialized");
            return;
        }

        const sockets = Array.from(this.#namespace?.sockets.values() ?? [])
            .filter(socket => socket.data.gameId === gameId && socket.data.playerId === playerId);

        for (const socket of sockets) {
            socket.emit(event.type, this.#transformPayload(event));
        }
    }

    #transformPayload(event: GameEvent): any {
        if (event instanceof Serializable) {
            return event.serialize();
        }
        return event.payload;
    }
}