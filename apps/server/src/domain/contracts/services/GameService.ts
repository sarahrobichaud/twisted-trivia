import { Game } from "~/domain/entities/Game.js";
import { Player } from "~/domain/entities/Player.js";
import { Quiz } from "~/domain/entities/Quiz.js";
import { ConnectionAuthorization } from "~/domain/values/ConnectionAuthorization.js";

export interface GameService {

    createGame(quiz: Quiz): Promise<ConnectionAuthorization>;
    joinGame(Game: Game): Promise<ConnectionAuthorization>;

    getByJoinCode(joinCode: string): Promise<Game | null>;
    getByID(gameId: string): Promise<Game | null>;

    getPlayer(gameId: string, playerId: string): Promise<Player | null>;
}




