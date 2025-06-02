import { Game } from "@domain/entities/Game.js";

export interface GameRepository {
    registerGame(game: Game): Promise<void>;
    findByJoinCode(joinCode: string): Promise<Game | null>;
    findById(id: string): Promise<Game | null>;
    delete(game: Game): Promise<void>;
    getAll(): Promise<Game[]>;
}

