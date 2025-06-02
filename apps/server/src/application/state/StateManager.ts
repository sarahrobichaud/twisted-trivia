
import { Game } from "~/domain/entities/Game.js";
import { ApplicationStateManager } from "~/domain/contracts/ApplicationStateManager.js";

export class StateManager implements ApplicationStateManager {

    #gameStorage: Map<string, Game> = new Map();
    #interval: NodeJS.Timeout | null = null;

    constructor() {
        this.#interval = setInterval(() => {
            console.log("Games", this.#gameStorage.size);
            for (const game of this.#gameStorage.values()) {
                if(game.isExpired) {
                    game.destroy();
                    this.removeGame(game);
                }
            }
        }, 1000);
    }

    // Use join code as key based on usage
    addGame(game: Game) {
        this.#gameStorage.set(game.joinCode, game);
    }

    getAllGames() {
        return Array.from(this.#gameStorage.values());
    }

    removeGame(game: Game) {
        this.#gameStorage.delete(game.joinCode);
    }

    getGameByID(gameID: string) {
        const game = Array.from(this.#gameStorage.values()).find(g => g.id === gameID);

        if (!game) {
            return null;
        }

        return game;
    }

    getGameByJoinCode(joinCode: string) {
        const found = this.#gameStorage.get(joinCode);

        if (!found) {
            return null;
        }

        return found;
    }
}
