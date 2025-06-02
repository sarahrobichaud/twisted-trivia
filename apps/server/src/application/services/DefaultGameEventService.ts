import { GameEventPublisher } from "../gateways/outbound/GameEventPublisher.js";
import { GameRole } from "~/domain/roles/GameRoles.js";
import { GameEvent, GameEventMetadata } from "~/domain/events/GameEvents.js";
import { GameEventService } from "~/domain/contracts/services/GameEventService.js";

export class DefaultGameEventService implements GameEventService {

    #publisher: GameEventPublisher;

    constructor(publisher: GameEventPublisher) {
        this.#publisher = publisher;
    }

    emit(metadata: GameEventMetadata, event: GameEvent): void {
        this.#routeEvents(metadata, event);
    }

    #routeEvents(metadata: GameEventMetadata, event: GameEvent): void {

        const { roles, gameId } = metadata;

        console.log("Routing event", gameId, event.type);

        if (roles.includes(GameRole.HOST)) {
            this.#publisher.publishToRole(gameId, GameRole.HOST, event);
        }

        if (roles.includes(GameRole.PLAYER)) {
            this.#publisher.publishToGame(gameId, event);
        }
    }
}