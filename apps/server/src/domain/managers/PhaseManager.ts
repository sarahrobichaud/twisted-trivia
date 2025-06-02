import { GamePhase } from "../phases/GamePhases.js";

export class PhaseManager {

    #currentPhase: GamePhase;

    #phaseUpdateHandler: (() => void) | null = null;

    constructor() {
        this.#currentPhase = GamePhase.WAITING;
    }

    set phaseUpdateHandler(handler: () => void) {
        this.#phaseUpdateHandler = handler;
    }

    get hasStarted(): boolean {
        return this.#currentPhase !== GamePhase.WAITING;
    }

    get isWaiting(): boolean {
        return this.#currentPhase === GamePhase.WAITING;
    }

    get isPlaying(): boolean {
        return this.#currentPhase === GamePhase.PLAYING;
    }

    get isCooldown(): boolean {
        return this.#currentPhase === GamePhase.COOLDOWN;
    }

    get isEnded(): boolean {
        return this.#currentPhase === GamePhase.ENDED;
    }

    get currentPhase(): GamePhase {
        return this.#currentPhase;
    }

    setCurrentPhase(phase: GamePhase) {
        this.#currentPhase = phase;

        if (this.#phaseUpdateHandler) {
            this.#phaseUpdateHandler();
        }
    }
}
