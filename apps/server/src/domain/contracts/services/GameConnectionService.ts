import { Game } from "~/domain/entities/Game.js";
import { Player } from "~/domain/entities/Player.js";
import { ConnectionAuthorization } from "~/domain/values/ConnectionAuthorization.js";

export interface GameConnectionService {
    isGameJoinable(gameId: string, playerId: string): Promise<boolean>;
    authenticate(gameId: string, token: string, username?: string): Promise<Player | null>;
    connect(connectionId: string, gameId: string, playerId: string): Promise<void>;
    disconnect(gameId: string, playerId: string): Promise<void>;
    generateAccessToken(gameId: string, playerId: string): Promise<string>;
    generateConnectionAuthorization(game: Game, player: Player): Promise<ConnectionAuthorization>
}
