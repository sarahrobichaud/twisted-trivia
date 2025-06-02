import { Player } from "@domain/entities/Player.js";
import { Routine } from "@domain/contracts/Routine.js";
import { PhaseManager } from "./PhaseManager.js";

export class PlayerManager implements Routine {

    #maxPlayerCount: number = 8; // default 
    #connections: Player[] = [];
    #cleanupInterval: NodeJS.Timeout | null = null;

    #playerUpdateHandler: (() => void) | null = null;
    #hostLeftHandler: (() => void) | null = null;

    #phaseManager: PhaseManager;

    #endResult: Player[] | null = null;

    constructor(phaseManager: PhaseManager) {
        this.#phaseManager = phaseManager;
    }

    set playerUpdateHandler(handler: () => void) {
        this.#playerUpdateHandler = handler;
    }

    set hostLeftHandler(handler: () => void) {
        this.#hostLeftHandler = handler;
    }

    set maxPlayerCount(count: number) {
        this.#maxPlayerCount = count;
    }

    get connectionCount(): number {
        return this.#connections.length;
    }

    get isFull(): boolean {
        return this.#connections.length > this.#maxPlayerCount;
    }

    get isEmpty(): boolean {
        return this.#connections.length === 0;
    }

    get connectedCount(): number {
        return this.#connections.filter(p => p.isConnected).length;
    }

    get connectedPlayerCount(): number {
        return this.#connections.filter(p => p.isConnected && p.playable).length;
    }

    get answeredCount(): number {
        return this.#connections.filter(p => p.hasAnswered).length;
    }

    get onlyHostLeft(): boolean {
        return this.#connections.filter(p => p.isConnected).every(p => p.isHost);
    }

    startCleanupRoutine(): void {
        this.#cleanupInterval = setInterval(() => {
            const size = this.#connections.length;
            this.#connections = this.#connections.filter(p => !p.isOrphan);

            if (this.#connections.length !== size) {
                console.log(`Cleaned up to ${this.#connections.length} players from ${size}`);
                this.#playerUpdateHandler?.();
            }
        }, 1000);
    }

    resetPlayerAnswers(): void {
        this.#connections.forEach(p => p.hasAnswered = false);
    }

    addPlayer(player: Player): void {
        this.#connections.push(player);
    }

    removePlayer(player: Player): void {
        this.disconnectPlayer(player);
        this.#connections = this.#connections.filter(p => p.id !== player.id);
        this.#playerUpdateHandler?.();
    }

    connectPlayer(connectionId: string, player: Player): void {
        player.connect(connectionId);
    }

    disconnectPlayer(player: Player): void {
        player.disconnect();
        if (player.isHost && !this.#phaseManager.isEnded) {
            this.#hostLeftHandler?.();
        }
    }

    getPlayers(): Player[] {

        if (this.#phaseManager.isWaiting) {
            return this.#connections;
        }

        if (this.#phaseManager.isEnded && this.#endResult) {
            return this.#endResult;
        }

        return this.#connections.filter(p => p.isConnected && p.playable);
    }

    saveEndResult(): void {
        this.#endResult = this.#connections.filter(p => p.isConnected && p.playable).sort((a, b) => b.score - a.score);
    }

    resetEndResult(): void {
        this.#endResult = null;
    }

    getPlayer(id: string): Player | null {
        return this.#connections.find(p => p.id === id) ?? null;
    }

    getPlayablePlayers(): Player[] {
        return this.#connections.filter(p => p.isConnected && p.playable);
    }

    destroy(): void {
        if (this.#cleanupInterval) {
            clearInterval(this.#cleanupInterval);
        }
    }
}   
