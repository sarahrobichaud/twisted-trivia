import { GameEvent, GameEventMetadata } from "~/domain/events/GameEvents.js";

export interface GameEventEmitter {
    emit(metadata: GameEventMetadata, event: GameEvent): void;
}