import { Game } from "../entities/Game.js";

export interface ApplicationStateManager {
    addGame(game: Game): void;
    removeGame(game: Game): void;
    getGameByJoinCode(joinCode: string): Game | null;
    getGameByID(id: string): Game | null;
    getAllGames(): Game[];
}
