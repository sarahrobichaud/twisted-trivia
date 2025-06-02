import { Game } from "@domain/entities/Game.js";
import { GameRepository } from "@domain/contracts/repositories/GameRepository.js";
import { ApplicationStateManager } from "~/domain/contracts/ApplicationStateManager.js";

export class InMemoryGameRepository implements GameRepository {

    #stateManager: ApplicationStateManager;

    constructor(stateManager: ApplicationStateManager) {
        this.#stateManager = stateManager;
    }

    async registerGame(game: Game): Promise<void> {
        this.#stateManager.addGame(game);
    }

    async findByJoinCode(joinCode: string): Promise<Game | null> {
        return this.#stateManager.getGameByJoinCode(joinCode);
    }

    async findById(id: string): Promise<Game | null> {
        return this.#stateManager.getGameByID(id);
    }

    async delete(game: Game): Promise<void> {
        this.#stateManager.removeGame(game)
    }

    async getAll(): Promise<Game[]> {
        return this.#stateManager.getAllGames();
    }

}
