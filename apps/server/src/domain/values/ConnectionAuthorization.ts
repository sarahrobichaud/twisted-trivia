import { Game } from "@domain/entities/Game.js";
import { Player } from "@domain/entities/Player.js";

export interface ConnectionAuthorization {
    game: Game;
    player: Player;
    accessToken: string;
}


